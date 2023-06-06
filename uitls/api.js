export const getData = async (endpoint) => {
  const options = {
    method: "GET",
  };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      options
    );
    if (!res.ok) {
      throw new Error(`Failed to retrieve data ${endpoint}}`);
    }
    const data = await res?.json();

    return data;
  } catch (error) {
    console.error(error)
  }
};
