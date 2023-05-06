
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const add_card = require('../db/add_card');
const adminuser = require('../db/adminuser');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors')
const path = require('path');
var fs = require('fs');




router.use(cors())

var corsOptions = {
  origin: "http://cserajon.xyz/",
  optionsSuccessStatus: 200
}

const multer = require('multer');

var storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var upload = multer({ storage: storage }).single('picture')




mongoose.connect('mongodb+srv://rajonhossaindhaka:3MfTD6daYp5djh5i@cluster0.nodwt.mongodb.net/idcardManage')
  .then(data => {
    console.log("connecting db successfully");
  })
  .catch(error => {
    console.log("error");
  })



router.get('/', function (req, res, next) {
  res.json({ status: 'Success' });
});



router.use('/filepath', express.static('./uploads'))
router.post('/addidcard_withfile', function (req, res, next) {


  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send('A Multer error occurred when uploading.');
    } else if (err) {
      res.send('else error!');
    }

    if (req.file) {
      add_card.findOne({ class_roll: req.body.class_roll })
        .then(data => {
          if (data) {
            fs.unlinkSync('./uploads/' + req.file.filename);
            res.json({ status: false, message: 'Already have is data', result: [], files: req.file.filename });
          } else {
            const card = new add_card({
              student_name: req.body.student_name,
              class_roll: req.body.class_roll,
              blood_group: req.body.blood_group,
              student_phone_number: req.body.student_phone_number,
              parents_phone_number: req.body.parents_phone_number,
              degree: req.body.degree,
              department: req.body.department,
              section: req.body.section,
              session: req.body.session,
              group: req.body.group,
              picture: req.file.filename
            })
            card.save()
              .then((result) => {
                res.json({ status: true, message: 'Success', result: result });
              })
              .catch((error) => {
                res.json({ status: false, message: error });
              });
          }
        })
    } else {
      res.send('File uploaded faild');
    }
  })
});



router.post('/idcard_delete', function (req, res, next) {

  add_card.findOneAndDelete({ _id: req.body.id })
    .then((data) => {
      const imagePath = './uploads/' + req.body.image_name;
      fs.unlink(imagePath, (err) => {
        if (!err) {
          res.json({ status: true, message: "success", data: data });
        }
      });
    })

})




router.post('/admin_regi', function (req, res, next) {
  const regi = new adminuser({
    username: "admin",
    email: "admin@gmail.com",
    password: "a123456",
  })

  regi.save()
    .then(() => {
      res.json({ status: 'Success' });
    })
    .catch((error) => {
      res.json({ status: error });
    });
})



router.post('/admin_login', function (req, res, next) {

  adminuser.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        var loginss = bcrypt.compareSync(req.body.password, data.password);
        if (loginss) {
          const token = jwt.sign({ email: req.body.email }, "154364asdfasdfs", { expiresIn: "2h", });
          res.status(200).json({
            login_status: true,
            message: 'login successfully',
            token: token,
            data: {
              "username": data.username,
              "email": data.email
            }
          })
        } else {
          res.json({ login_status: false, message: 'password not matching the query' });
        }
      } else {
        res.json({ login_status: false, message: 'email address not matching the query' });
      }
    })
    .catch((err) => {
      res.json({ login_status: false, message: 'server error' });
    });

});


// router.post('/addidcard', function (req, res, next) {

//   const authHeader = req.header('Authorization');
//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, "154364asdfasdfs", (err, decoded) => {
//     if (err) {
//       res.json({ status: false, message: 'not verfy' });
//     } else {
//       if (decoded.email === req.body.email) {

//         const card = new add_card({
//           student_name: req.body.student_name,
//           class_roll: req.body.class_roll,
//           blood_group: req.body.blood_group,
//           student_phone_number: req.body.student_phone_number,
//           parents_phone_number: req.body.parents_phone_number,
//           degree: req.body.degree,
//           department: req.body.department,
//           section: req.body.section,
//           session: req.body.session,
//           group: req.body.group,
//           picture: req.body.picture
//         })


//         card.save()
//           .then(() => {
//             res.json({ status: true, message: 'Success' });
//           })
//           .catch((error) => {
//             res.json({ status: false, message: error });
//           });


//       } else {
//         res.json({ status: false, message: 'not error verfy' });
//       }
//     }
//   });

// });

router.get('/idcard', function (req, res, next) {

  add_card.find().then(function (err, result) {
    if (!err) {
      res.status(200).json({ result: result })
    } else {
      res.status(200).json({ result: err })
    }
  })



})




module.exports = router;





