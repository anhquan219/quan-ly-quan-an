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
    const canvas = canvasRef.current;
    QRCode.toCanvas(canvas, linkUrl, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
  }, [linkUrl]);

  return <canvas ref={canvasRef} />;
}
