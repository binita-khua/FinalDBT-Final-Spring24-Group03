import FlatfilePersistence from "./flatfile";

interface Review {
  review_id: number;
  book_id: number;
  customer_id: number;
  review_rating: number;
  review_text?: string;
  review_date: string;
}

export default class ReviewsTable {
  private persistence: FlatfilePersistence;
  private tableName = "reviews";
  private idCounter: number;

  constructor() {
    this.persistence = new FlatfilePersistence();
    this.persistence.create(this.tableName);
    this.idCounter = this.getNextId();
  }

  private getNextId(): number {
    const reviews = this.getAllReviews();
    if (reviews.length === 0) {
      return 1;
    } else {
      return Math.max(...reviews.map(review => review.review_id)) + 1;
    }
  }

  createReview(book_id: number, customer_id: number, review_rating: number, review_date: string, review_text?: string): Review {
    const newReview: Review = {
      review_id: this.idCounter,
      book_id,
      customer_id,
      review_rating,
      review_text,
      review_date
    };

    this.persistence.insert<Review>(newReview, this.tableName);
    this.idCounter += 1;
    return newReview;
  }

  getAllReviews(): Review[] {
    try {
      const reviews: Review[] = JSON.parse(this.persistence.read(this.tableName));
      return reviews;
    } catch {
      return [];
    }
  }

  updateReview(review_id: number, updatedReview: Partial<Review>): void {
    const reviews = this.getAllReviews();
    const reviewIndex = reviews.findIndex(review => review.review_id === review_id);

    if (reviewIndex !== -1) {
      reviews[reviewIndex] = { ...reviews[reviewIndex], ...updatedReview };
      this.persistence.update(reviews, this.tableName);
    } else {
      throw new Error("Review not found");
    }
  }

  deleteReview(review_id: number): void {
    const reviews = this.getAllReviews();
    const review = reviews.find(review => review.review_id === review_id);

    if (review) {
      this.persistence.delete<Review>(review, this.tableName);
    } else {
      throw new Error("Review not found");
    }
  }
}
