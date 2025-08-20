export const getDeliveryFee = async (req, res) => {
  try {
    const { dropOff, errands } = req.body;
    if (!dropOff, errands) {
      return res.json({ success: false, message: "Invalid data" });
    }

    
    const deliveryFee = await calculateDeliveryFee(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

    return res.json({ success: true, deliveryFee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};