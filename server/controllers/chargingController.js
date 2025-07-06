import Slot from '../models/slot.js';

export async function startCharging(req, res) {
  const { slotId } = req.body;
  const slot = await Slot.findById(slotId);
  if (!slot) return res.status(404).json({ message: 'Slot not found' });

  slot.isCharging = true;
  await slot.save();

  res.json({ message: 'Charging started' });
}

export async function stopCharging(req, res) {
  const { slotId } = req.body;
  const slot = await Slot.findById(slotId);
  if (!slot) return res.status(404).json({ message: 'Slot not found' });

  slot.isCharging = false;
  await slot.save();

  res.json({ message: 'Charging stopped' });
}
