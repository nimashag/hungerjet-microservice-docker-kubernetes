import { Request, Response } from 'express';
import * as restaurantsService from '../services/restaurants.service';

// interface AuthenticatedRequest extends Request {
//     user?: { _id: string }; // You can define a more specific user type later
//   }
  
//   export const create = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       console.log('▶️ Creating a new restaurant:', req.body);
//       const userId = req.user?._id;
//       if (!userId) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
  
//       const restaurant = await restaurantsService.createRestaurant(req.body, userId);
//       console.log('Created restaurant with ID:', restaurant._id);
//       res.json(restaurant);
//     } catch (err) {
//       console.error('Error creating restaurant:', err);
//       res.status(500).json({ message: 'Something went wrong' });
//     }
// };

// export const create = async (req: Request, res: Response) => {
//     try {
//       console.log('▶️ Creating a new restaurant:', req.body);
  
//       // 🔧 Hardcoded userId (replace with your actual MongoDB user ObjectId)
//       const hardcodedUserId = '661fe9d0c2e7e814f44fc877';

//       const image = req.file?.filename;
      
//       const restaurant = await restaurantsService.createRestaurant(req.body, hardcodedUserId);
//       console.log('Created restaurant with ID:', restaurant._id);
//       res.json(restaurant);
//     } catch (err) {
//       console.error('Error creating restaurant:', err);
//       res.status(500).json({ message: 'Something went wrong' });
//     }
//   };

export const create = async (req: Request, res: Response) => {
    try{
    console.log('▶️ Creating a new restaurant:', req.body);

    const { name, address } = req.body;
    const image = req.file?.filename;

    const hardcodedUserId = '661fdbecf622d9bd45edb859'; // Replace with your actual ObjectId string

    const restaurant = await restaurantsService.createRestaurant(
        { name, address, image },
        hardcodedUserId
    );

    console.log('✅ Created restaurant with ID:', restaurant._id);
    res.json(restaurant);
    }catch (err) {
          console.error('Error creating restaurant:', err);
          res.status(500).json({ message: 'Something went wrong' });
        }
};

  

export const list = async (_req: Request, res: Response) => {
    console.log('▶️ Fetching all restaurants');
    const restaurants = await restaurantsService.getAllRestaurants();
    console.log(`Found ${restaurants.length} restaurants`);
    res.json(restaurants);
};

export const getOne = async (req: Request, res: Response) => {
    console.log('▶️ Fetching restaurant with ID:', req.params.id);
    const restaurant = await restaurantsService.getRestaurantById(req.params.id);
    if (!restaurant) {
        console.warn('Restaurant not found:', req.params.id);
    } else {
        console.log('Restaurant found:', restaurant.name);
    }
    res.json(restaurant);
};

export const toggleAvailability = async (req: Request, res: Response) => {
    console.log('▶️ Toggling availability for restaurant ID:', req.params.id);
    const updated = await restaurantsService.toggleAvailability(req.params.id);
    console.log('Updated availability to:', updated?.available);
    res.json(updated);
};

export const addMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Adding menu item for restaurant ID:', req.params.id, 'Item:', req.body);

    const { name, description, price } = req.body;
    const image = req.file?.filename; // For image upload

    // Hardcoded user ID for testing
    const hardcodedUserId = '661fe9d0c2e7e814f44fc877'; // Replace with actual userId

    // Create the item with restaurantId and userId
    const item = await restaurantsService.addMenuItem(
        req.params.id, // restaurantId
        { name, description, price, image, userId: hardcodedUserId } // item data with userId
    );

    console.log('✅ Added menu item with ID:', item._id);
    res.json(item);
};

export const listMenuItems = async (req: Request, res: Response) => {
    console.log('▶️ Fetching menu items for restaurant ID:', req.params.id);
    const items = await restaurantsService.listMenuItems(req.params.id);
    console.log(`Found ${items.length} menu items`);
    res.json(items);
};

export const updateMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Updating menu item ID:', req.params.itemId, 'Payload:', req.body);
    const item = await restaurantsService.updateMenuItem(req.params.itemId, req.body);
    console.log('Updated menu item:', item?._id);
    res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    console.log('▶️ Deleting menu item ID:', req.params.itemId);
    const item = await restaurantsService.deleteMenuItem(req.params.itemId);
    console.log('Deleted menu item:', item?._id);
    res.json(item);
};

