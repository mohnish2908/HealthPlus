exports.validateFoodInput = (req, res, next) => {
    const { foodItem } = req.body;
    if (!foodItem) {
        return res.status(400).json({
            success: false,
            message: "Food item is required",
        });
    }
    next();
};
