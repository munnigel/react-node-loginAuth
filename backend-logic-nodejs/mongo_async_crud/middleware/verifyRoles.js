// Verify if the user has the required roles to access the route
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.status(401).json({ "message": "Don't have sufficient roles to access this data" });
        next();
    }
}

module.exports = verifyRoles