const Operation = require("../models/operationModel");
const User = require("../models/userModel");
const Card = require("../models/creditModel");

const getOperations = async (req, res) => {
  try {
    const operations = await Operation.find();
    res.status(200).json(operations);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getOperation = async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id);
    res.status(200).json(operation);
  } catch {
    res.status(404).json({ message: "Operation not found" });
  }
};


const createOperation = async (req, res) => {
  const {username, amount} = req.body.username;
  console.log(username, amount);
  
  try {

    const user = await User.findById(username);
    const operation = await Operation.create(req.body);

    console.log(user);
    console.log(operation);
    
    operation.userId = user;
    console.log(operation.userId);

    const paymentOption = operation.paymentType;
    console.log(paymentOption);

    if (paymentOption == "wallet"){
      user.balance -= amount;
      console.log(user.balance);
      await User.updateOne({userName: username }, { $set: { balance: user.balance }}); 
    }
    else{

      try{
        user.creditCard.balance -= amount;
        await Card.updateOne({_id : user.creditCard._id }, { $set: { balance: user.creditCard.balance }}); 

      }
      catch(e){
        res.status(403).json({ 
            message: "User doesn't have a registered electronic credit card", 
            status: false 
          });
      }
      
    }

    res.status(200).json(operation, {status: true});
  } catch (err) {
    res.status(403).json({ message: err, status: false });
  }
};

const updateOperation = async (req, res) => {
  try {
    await Operation.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Operation updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteOperation = async (req, res) => {
  try {
    await Operation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Operation is deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation,
};