export const getQrCodeUrl = (data) =>
  `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    data
  )}&size=200x200`;
