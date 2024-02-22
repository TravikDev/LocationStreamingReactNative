"use strict";

module.exports = {
  register(/*{ strapi }*/) {},
  bootstrap({ strapi }) {
    // @ts-ignore
    const io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: "http://192.168.100.2:8081",
        methods: ["GET", "POST"],
        allowedHeaders: "*",
        // credentials: true,
      },
    });

    io.on("connect_error", (err) => {
      console.log(err.message);
      console.log(err.description);
      console.log(err.context);
    });

    io.on("connection", (socket) => {
      console.log("connected", socket.id);

      socket.on("create-location", async (data) => {
        try {
          const entry = await strapi.entityService.findOne(
            "api::location.location",
            1,
            {
              fields: ["latitude", "longitude"],
              populate: { category: true },
            }
          );

          if (!entry) {
            await strapi.entityService.create("api::location.location", {
              data,
            });

            io.emit("update-location", {
              latitude: entry?.latitude,
              longitude: entry?.longitude,
            });
          }
        } catch (error) {
          console.error("Error updating location:", error);
        }
      });

      socket.on("update-location", async (data) => {
        try {
          await strapi.entityService.update("api::location.location", 1, {
            data,
          });

          const entry = await strapi.entityService.findOne(
            "api::location.location",
            1,
            {
              fields: ["latitude", "longitude"],
              populate: { category: true },
            }
          );

          io.emit("update-location", {
            latitude: entry?.latitude,
            longitude: entry?.longitude,
          });
        } catch (error) {
          console.error("Error updating location:", error);
        }
      });
    });
  },
};
