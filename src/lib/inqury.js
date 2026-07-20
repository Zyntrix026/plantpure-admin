import { api } from "./api";

/**
 * @desc   सभी इनक्वायरी (Inquiries) को फेच करने के लिए
 */
export const getAllInquiries = async () => {
  try {
    const response = await api.get(`/inquiries`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch inquiries"
    );
  }
};

/**
 * @desc   नई इनक्वायरी क्रिएट करने के लिए (Subject हटा दिया गया है)
 * @param  {Object} inquiryData - { name, email, mobile, productType, quantity, message, dataConsent }
 */
export const createInquiry = async (inquiryData) => {
  try {
    // बैकएंड पर POST रिक्वेस्ट भेज रहे हैं
    const response = await api.post(`/inquiries`, inquiryData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to create inquiry"
    );
  }
};

/**
 * @desc   किसी इनक्वायरी का स्टेटस अपडेट करने के लिए
 */
export const updateInquiryStatus = async (id, status) => {
  try {
    // नोट: अगर आपके बैकएंड का रूट `/inquiries/:id` है, तो इसे `/inquiries/${id}` भी कर सकते हैं
    const response = await api.patch(`/inquiries/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update inquiry status"
    );
  }
};

/**
 * @desc   डेटाबेस से किसी इनक्वायरी को डिलीट करने के लिए
 * @param  {String} id - इनक्वायरी की MongoDB ID
 */
export const deleteInquiry = async (id) => {
  try {
    // बैकएंड पर DELETE रिक्वेस्ट भेज रहे हैं
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "डेटाबेस से इनक्वायरी डिलीट करने में विफल"
    );
  }
};