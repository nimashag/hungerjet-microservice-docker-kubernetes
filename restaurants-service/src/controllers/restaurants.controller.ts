import { Request, Response } from "express";
import * as restaurantsService from "../services/restaurants.service";

export const create = async (req: Request, res: Response) => {
  try {
    console.log("▶️ Creating a new restaurant:", req.body);

    const { name, address } = req.body;
    const image = req.file?.filename;

    const hardcodedUserId = "661fdbecf622d9bd45edb859"; // Replace with your actual ObjectId string

    const restaurant = await restaurantsService.createRestaurant(
      { name, address, image },
      hardcodedUserId
    );

    console.log("✅ Created restaurant with ID:", restaurant._id);
    res.json(restaurant);
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const list = async (_req: Request, res: Response) => {
  try {
    console.log("▶️ Fetching all restaurants");
    const restaurants = await restaurantsService.getAllRestaurants();
    console.log(`Found ${restaurants.length} restaurants`);
    res.json(restaurants);
  } catch (err) {
    console.error("Error listing restaurants:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    console.log("▶️ Updating restaurant ID:", req.params.id);

    const updateData: any = { ...req.body };

    if (req.file?.filename) {
      updateData.image = req.file.filename;
    }

    const updated = await restaurantsService.updateRestaurant(
      req.params.id,
      updateData
    );

    if (!updated) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    console.log("✅ Updated restaurant:", updated._id);
    res.json(updated);
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  console.log("▶️ Fetching restaurant with ID:", req.params.id);
  const restaurant = await restaurantsService.getRestaurantById(req.params.id);
  if (!restaurant) {
    console.warn("Restaurant not found:", req.params.id);
  } else {
    console.log("Restaurant found:", restaurant.name);
  }
  res.json(restaurant);
};

export const toggleAvailability = async (req: Request, res: Response) => {
  console.log("▶️ Toggling availability for restaurant ID:", req.params.id);
  const updated = await restaurantsService.toggleAvailability(req.params.id);
  console.log("Updated availability to:", updated?.available);
  res.json(updated);
};

export const addMenuItem = async (req: Request, res: Response) => {
  console.log(
    "▶️ Adding menu item for restaurant ID:",
    req.params.id,
    "Item:",
    req.body
  );

  const { name, description, price } = req.body;
  const image = req.file?.filename; // For image upload

  // Hardcoded user ID for testing
  const hardcodedUserId = "661fe9d0c2e7e814f44fc877"; // Replace with actual userId

  // Create the item with restaurantId and userId
  const item = await restaurantsService.addMenuItem(
    req.params.id, // restaurantId
    { name, description, price, image, userId: hardcodedUserId } // item data with userId
  );

  console.log("✅ Added menu item with ID:", item._id);
  res.json(item);
};

export const listMenuItems = async (req: Request, res: Response) => {
  console.log("▶️ Fetching menu items for restaurant ID:", req.params.id);
  const items = await restaurantsService.listMenuItems(req.params.id);
  console.log(`Found ${items.length} menu items`);
  res.json(items);
};

export const getOneMenuItem = async (req: Request, res: Response) => {
    console.log("▶️ Fetching menu item with ID:", req.params.itemId);
  
    const item = await restaurantsService.getOneMenuItem(req.params.itemId);
  
    if (!item) {
      console.warn("❌ Menu item not found:", req.params.itemId);
      return res.status(404).json({ message: "Menu item not found" });
    }
  
    console.log("✅ Menu item found:", item.name);
    res.json(item);
  };
  

export const updateMenuItem = async (req: Request, res: Response) => {
    try {
      console.log("▶️ Updating menu item ID:", req.params.itemId);
  
      const updateData: any = { ...req.body };
  
      if (req.file?.filename) {
        updateData.image = req.file.filename;
      }
  
      const updatedItem = await restaurantsService.updateMenuItem(
        req.params.itemId,
        updateData
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      console.log("✅ Updated menu item:", updatedItem._id);
      res.json(updatedItem);
    } catch (err) {
      console.error("Error updating menu item:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    console.log("▶️ Deleting menu item ID:", req.params.itemId);

    const deleted = await restaurantsService.deleteMenuItem(req.params.itemId);

    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    console.log("✅ Deleted menu item");
    res.status(204).send(); // No content
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
