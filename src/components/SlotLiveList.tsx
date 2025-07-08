import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { socket } from "@/lib/socket";

type Slot = {
  _id: string;
  slotNumber: string;
  floor: string;
  section: string;
  status: "available" | "busy" | "offline";
  power?: string;
  price?: string;
  distance?: string;
  rating?: number;
};

const SlotLiveList = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);

  const [floorFilter, setFloorFilter] = useState<string>("");
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "none">("none");

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get<Slot[]>("http://localhost:5001/api/slots/available");
      setSlots(response.data);
      setFilteredSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const applyFiltersAndSort = () => {
    let updated = [...slots];

    if (floorFilter) {
      updated = updated.filter((slot) => slot.floor === floorFilter);
    }

    if (sectionFilter) {
      updated = updated.filter((slot) => slot.section === sectionFilter);
    }

    if (sortBy === "distance") {
      updated.sort((a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0"));
    } else if (sortBy === "rating") {
      updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredSlots(updated);
  };

  useEffect(() => {
    fetchAvailableSlots();

    socket.on("slotUpdated", (updatedSlot: Slot) => {
      setSlots((prev) =>
        prev.map((slot) => (slot._id === updatedSlot._id ? updatedSlot : slot))
      );
    });

    return () => {
      socket.off("slotUpdated");
    };
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [floorFilter, sectionFilter, sortBy, slots]);

  // Get unique floors/sections for dropdowns
  const floors = Array.from(new Set(slots.map((s) => s.floor)));
  const sections = Array.from(new Set(slots.map((s) => s.section)));

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={setFloorFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Floors</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor}>{floor}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSectionFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sections</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>{section}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setSortBy(val as "distance" | "rating" | "none")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sorting</SelectItem>
            <SelectItem value="distance">Distance (Nearest)</SelectItem>
            <SelectItem value="rating">Rating (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Slot Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map((slot) => (
          <Card key={slot._id} className="shadow border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Slot #{slot.slotNumber}</span>
                <Badge
                  variant={
                    slot.status === "available"
                      ? "secondary"
                      : slot.status === "busy"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {slot.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Floor:</strong> {slot.floor}</p>
              <p><strong>Section:</strong> {slot.section}</p>
              {slot.power && <p><strong>Power:</strong> {slot.power}</p>}
              {slot.price && <p><strong>Price:</strong> ₹{slot.price}/hr</p>}
              {slot.distance && <p><strong>Distance:</strong> {slot.distance}m</p>}
              {slot.rating !== undefined && <p><strong>Rating:</strong> ⭐ {slot.rating}/5</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SlotLiveList;
