const {
   day,
   hours,
   minutes,
   month,
   year
} = require('./date')
const {
   cancelled,
   confirmed,
   finished,
   onDelivery,
   paidWaitConfirm,
   payCOD,
   payZaloPay,
   received,
   waitConfirm
} = require('./process')

module.exports = {
   day,
   hours,
   minutes,
   month,
   year,
   cancelled,
   confirmed,
   finished,
   onDelivery,
   paidWaitConfirm,
   payCOD,
   payZaloPay,
   received,
   waitConfirm
}