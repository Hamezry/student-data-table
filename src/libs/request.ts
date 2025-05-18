import { apiNoAuth } from "./api";

export const fetchData = async () => {
  const response = await apiNoAuth.get(`viewAllData`);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const fetchLevels = async () => {
  const response = await apiNoAuth.get(`viewAllLevels`);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const fetchStates = async () => {
  const response = await apiNoAuth.get(`viewAllStates`);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const fetchGender = async () => {
  const response = await apiNoAuth.get(`viewAllGender`);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const fetchAges = async () => {
  const response = await apiNoAuth.get(`viewAllAges`);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const filterData = async (payload: {
  age?: number;
  state?: string;
  level?: string;
  gender?: string;
}) => {
  const response = await apiNoAuth.post(`filterData`, payload);
  if (response?.data) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

export const getResults = async (id: number) => {
  const response = await apiNoAuth.post(`viewResult/${id}`);
  if (response?.data) {
    return {
      student: response.data.data,
      logo: response.data.logo,
      profilePicture: response.data.profile_picture,
    };
  } else {
    throw new Error(response.data.message || "Error fetching data");
  }
};

