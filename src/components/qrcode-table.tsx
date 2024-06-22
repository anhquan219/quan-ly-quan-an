"use client";
import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRcodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkUrl = getTableLink({ token, tableNumber });

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    // Fill mầu trắng
    canvasContext.fillStyle = "#fff";
    // Điền thông tin vào thẻ canvas từ pixel 0,0 đến canvas.width, canvas.height
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "#000";
    canvasContext.textAlign = "center";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    );

    // Taoj thẻ canvas
    const virtalCanvas = document.createElement("canvas");

    QRCode.toCanvas(virtalCanvas, linkUrl, function (error) {
      if (error) console.error(error);
      // Vẽ QR virtalCanvas vào canvasContext
      canvasContext.drawImage(virtalCanvas, 0, 0, width, width);
    });
  }, [linkUrl, width]);

  return <canvas ref={canvasRef} />;
}
