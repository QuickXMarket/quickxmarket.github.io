const authSeller = async (req, res, next) =>{
    return res.json({ success: false, message: 'authSeller middleware deprecated. Use authUser with role check instead.' });
}

export default authSeller;
