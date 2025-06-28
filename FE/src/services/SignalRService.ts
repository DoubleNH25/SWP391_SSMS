// src/services/signalRService.ts
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";

let connection: HubConnection | null = null;

export const startSignalRConnection = async (token: string, onNotification: (data: any) => void) => {
  connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7172/notificationHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.on("ReceiveNotification", (message) => {
    onNotification(message);
  });

  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
  }
};
