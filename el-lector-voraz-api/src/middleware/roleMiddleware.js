export default permitirRoles
export function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "No tienes permisos" });
    }
    next();
  };
}
