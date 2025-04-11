import { Bus } from "../models/bus.model.js";
import AppError from "../utils/error.utils.js";

const addBus = async (req, res, next) => {
  try {
    const { busNo, routes, time, price } = req.body;

    if (!busNo || !routes || !time || !price) {
      return next(new AppError("Please provide busNo, routes and time.", 400));
    }

    const bus = await Bus.create({
      busNo,
      routes,
      time,
      price,
    });

    res.status(201).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const searchBus = async (req, res, next) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return next(
        new AppError(
          "Please provide both source and destination query parameters.",
          500
        )
      );
    }

    const buses = await Bus.aggregate([
      {
        $addFields: {
          sourceIndex: { $indexOfArray: ["$routes", source] },
          destinationIndex: { $indexOfArray: ["$routes", destination] },
        },
      },
      {
        $match: {
          sourceIndex: { $gte: 0 },
          destinationIndex: { $gte: 0 },
          $expr: { $lt: ["$sourceIndex", "$destinationIndex"] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: buses,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export {
    addBus,
    searchBus
}