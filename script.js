'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Arjun Gahlot',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rohan Kumar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rakesh Rosh',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ____________________________________________


let timer;

const now = new Date()
labelDate.textContent = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`




// _____________________________________
// DISPLAY MOVEMENTS
// _____________________________________


const displayMovements = function(acc,sort = false){
  containerMovements.innerHTML = '';
  
  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

  movs.forEach(function(mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// _____________________________________
// CALCULATING BALANCE
// _____________________________________

const calcDisplayBalance = function(acc){
  const balance = acc.movements.reduce((acc,mov) =>acc + mov,0);
  acc.balance=balance;
  labelBalance.textContent = `${acc.balance} €`;
};

// _____________________________________
// CREATING USER NAMES
// _____________________________________
const createUserName = function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(name =>name[0]).join('');
  });  
};
createUserName(accounts);

// _____________________________________
// UPDATING UI
// _____________________________________

const updateUI = function(acc){
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  if(timer) clearInterval(timer);
  timer = setTimers(300);
};

// _____________________________________
// UPDATING SUMMARY
// _____________________________________
const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov>0).reduce((acc,mov)=> acc+mov, 0);
  
  labelSumIn.textContent =`${incomes}€`
  
  const out = Math.abs(acc.movements.filter(mov => mov<0).reduce((acc,mov)=> acc+mov, 0));
  
  labelSumOut.textContent =`${out}€`
  
  const interest = acc.movements.filter(mov => mov>0).map(deposit=> deposit*acc.interestRate/100).filter(mov=> mov>=1).reduce((acc,int)=> acc+int, 0);
  labelSumInterest.textContent =`${interest}€`
}

// _____________________________________
// LOGIN
// _____________________________________

let currentAccount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc=>acc.username === inputLoginUsername.value)
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();
    
    updateUI(currentAccount);
  }
  else{
    containerApp.style.opacity = 0;
  }
})


// __________________________________________
// TRANSFER AMOUNT
// __________________________________________

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  let amount=Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(acc=>acc.username === inputTransferTo.value);
  console.log(amount>0);
  console.log(currentAccount.balance>=amount);
  
  inputTransferTo.value=inputTransferAmount.value='';
  inputTransferAmount.blur();
  
  if(amount>0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !==currentAccount.username){
    currentAccount.movements.push(0-amount);
    receiverAcc.movements.push(amount)
    
    updateUI(currentAccount);
    
  }
  else{
    alert('sry something went wrong...');
  }
});
// __________________________________________
// REQUEST LOAN
// __________________________________________

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const anydeposits = currentAccount.movements.some(mov => mov >= amount/10);
  console.log(anydeposits);
  if(anydeposits && Number(inputLoanAmount.value) > 0){
    currentAccount.movements.push(amount);
    
    inputLoanAmount.value='';
    inputLoanAmount.blur();
    updateUI(currentAccount);
  }
  else{
    inputLoanAmount.value='';
    inputLoanAmount.blur();
    updateUI(currentAccount);
    alert('sry amt is too big for u.....')
  }
});


// __________________________________________
// CLOSE ACCOUNT
// __________________________________________
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  // const USER = inputCloseUsername.value;
  // const USERpin = inputClosePin.value;
  if (inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log('a');
    accounts.splice(index , 1);
    containerApp.style.opacity = 0;
  }
  else{
    console.log(currentAccount);
  }
  
});

// __________________________________________
// SORT
// __________________________________________
let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount,sorted);
  if(timer) clearInterval(timer);
  timer = setTimers(300);
  /* //------------------------OTHER METHOD----------------
  let tempMovements = currentAccount.movements.slice();
  tempMovements.sort((a,b) => a-b);



  containerMovements.innerHTML = '';

  tempMovements.forEach(function(mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  */
});

// TIMER-----------------------------------------------------(function)------
const setTimers = function(time){            //here time is in sec
  let remainingTime = time;
  let timer;
  
  const tick = function() {
      const minutes = String(Math.trunc(remainingTime/60)).padStart(2,'0');
      const hours = String(Math.trunc(minutes/60)).padStart(2,'0');
      const seconds = String(Math.trunc(remainingTime%60)).padStart(2,'0');
      const time =  `${hours}:${minutes}:${seconds}`
      
      // In each call, print the remaining time to UI
      labelTimer.textContent = time;
      
      // document.querySelector('.<classname>').textContent = time;
      
      if (remainingTime==0) {
          clearInterval(timer)
          // <CONDITION> 
          labelWelcome.textContent = "Log in to get started";
          containerApp.style.opacity = 0;
      }
      
      remainingTime--;
      console.log(remainingTime);
  }
  tick()
  
  timer =  setInterval(tick, 1000);

  return timer;
};
