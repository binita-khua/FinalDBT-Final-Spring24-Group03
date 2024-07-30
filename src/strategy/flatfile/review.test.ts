import ReviewsTable from "./ReviewService";
import FlatfilePersistence from "./flatfile";
import fs from "fs";
import path from "path";

const getPath = (...dir: string[]) => path.join(__dirname, ...dir);

const removeDirectory = (dirPath: string, retries = 5): void => {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      const error = err as { code: string };
      if ((error.code === 'EBUSY' || error.code === 'ENOTEMPTY') && retries > 0) {
        setTimeout(() => removeDirectory(dirPath, retries - 1), 100);
      } else {
        throw err;
      }
    }
  }
};

describe("ReviewsTable", () => {
  beforeEach(() => {
    removeDirectory(getPath("flatfileDb"));
    new FlatfilePersistence(); // Ensure the directory is recreated for each test
  });

  afterEach(() => {
    removeDirectory(getPath("flatfileDb"));
  });

  it("should create a review and store it", () => {
    const reviewsTable = new ReviewsTable();
    const review = reviewsTable.createReview(1, 1, 5, "2023-01-01", "Great book!");

    expect(review).toEqual({
      review_id: 1,
      book_id: 1,
      customer_id: 1,
      review_rating: 5,
      review_text: "Great book!",
      review_date: "2023-01-01"
    });

    const storedReviews = reviewsTable.getAllReviews();
    expect(storedReviews).toEqual([review]);
  });

  it("should update an existing review", () => {
    const reviewsTable = new ReviewsTable();
    const review = reviewsTable.createReview(1, 1, 5, "2023-01-01", "Great book!");

    const updatedReview = {
      review_rating: 4,
      review_text: "Good book!"
    };

    reviewsTable.updateReview(review.review_id, updatedReview);

    const storedReviews = reviewsTable.getAllReviews();
    expect(storedReviews).toEqual([
      {
        review_id: 1,
        book_id: 1,
        customer_id: 1,
        review_rating: 4,
        review_text: "Good book!",
        review_date: "2023-01-01"
      }
    ]);
  });

  it("should delete an existing review", () => {
    const reviewsTable = new ReviewsTable();
    const review = reviewsTable.createReview(1, 1, 5, "2023-01-01", "Great book!");

    reviewsTable.deleteReview(review.review_id);

    const storedReviews = reviewsTable.getAllReviews();
    expect(storedReviews).toEqual([]);
  });

  it("should throw an error if trying to update a non-existent review", () => {
    const reviewsTable = new ReviewsTable();
    expect(() =>
      reviewsTable.updateReview(999, { review_rating: 4 })
    ).toThrow("Review not found");
  });

  it("should throw an error if trying to delete a non-existent review", () => {
    const reviewsTable = new ReviewsTable();
    expect(() => reviewsTable.deleteReview(999)).toThrow("Review not found");
  });
});
