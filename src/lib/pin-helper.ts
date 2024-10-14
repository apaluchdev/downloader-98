async function GetPinExpiry(pin: string): Promise<Date> {
  const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/file/pin/${pin}`); // TODO make this domain an env variable
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();

  if (data.expiryTime) {
    console.log("Expiry time:", data.expiryTime);
    return new Date(Date.parse(data.expiryTime));
  }

  console.log("No expiry time found for " + pin);

  return new Date();
}

export default GetPinExpiry;
