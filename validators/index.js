const registerValidator = (req, res, next) => {
    req.check("name").notEmpty().withMessage("Name is required")
        .matches(/^[a-z-_\s]+$/i).withMessage("Name should contain alphabets and space only")
        .trim().escape();

    req.check("email").notEmpty().withMessage("Email is required")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email")

    req.check("phone").notEmpty().withMessage("Phone Number is required!")
        .trim().escape()
        .isNumeric().withMessage("Phone number must be numeric")
        .isLength(10).withMessage("Phone number not valid");

    req.check("college").notEmpty().withMessage("College is required!")
        .trim().escape();

    req.check("dept").notEmpty().trim().escape().withMessage("Department is required!");

    req.check("year").notEmpty().trim().escape()
        .withMessage("Year is required!")
        .isInt({min: 1, max: 5}).withMessage("Year must be number between 1 and 5 inclusive.");

    req.check("pwd").notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must contain atleast eight characters")
        .trim().escape();

    const errors = req.validationErrors();

    if (errors) {
        const err = errors.map((error) => error.msg)[0];
        return res.status(400).send(
            {"message": err}
        )
    }

    next();
}

const signinValidator = (req, res, next) => {
    req.check("email").notEmpty().withMessage("Email is required")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email")

    req.check("pwd").notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must contain atleast eight characters")
        .trim().escape();

    const errors = req.validationErrors();

    if (errors) {
        const err = errors.map((error) => error.msg)[0];
        return res.status(400).send(
            {"message": err}
        )
    }

    next();
}

module.exports = {registerValidator, signinValidator}
