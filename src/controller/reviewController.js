import Review from "../models/Review.js";

export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    const { rating, comment } = req.body;

    const review = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name")
      .exec();

    res.status(200).json({
      status: "success",
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      status: "success",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }

    // 리뷰 작성자와 현재 로그인한 사용자가 다른 경우
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        status: "fail",
        message: "You can only delete your own reviews",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
