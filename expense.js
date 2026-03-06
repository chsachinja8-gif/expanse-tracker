let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

function addTransaction(){
  const desc=document.getElementById("desc").value;
  const amount=parseFloat(document.getElementById("amount").value);
  const type=document.getElementById("type").value;
  const category=document.getElementById("category").value;

  if(!desc || !amount){
    alert("Fill all fields");
    return;
  }

  const date=new Date();
  transactions.push({id:Date.now(),desc,amount,type,category,date});
  localStorage.setItem("transactions",JSON.stringify(transactions));

  document.getElementById("desc").value="";
  document.getElementById("amount").value="";
  render();
}

function render(){
  const list=document.getElementById("transactions");
  list.innerHTML="";

  let income=0, expense=0;

  transactions.forEach(t=>{
    if(t.type==="income") income+=t.amount;
    else expense+=t.amount;

    const div=document.createElement("div");
    div.className="transaction";
    div.innerHTML=`
      <span>${t.desc} (${t.category})</span>
      <span class="${t.type}">
        ${t.type==="income"?"+":"-"}₹${t.amount}
        <button onclick="deleteTransaction(${t.id})">❌</button>
      </span>
    `;
    list.appendChild(div);
  });

  document.getElementById("income").innerText=income;
  document.getElementById("expense").innerText=expense;
  document.getElementById("balance").innerText=income-expense;

  updateChart(income,expense);
}

function deleteTransaction(id){
  transactions=transactions.filter(t=>t.id!==id);
  localStorage.setItem("transactions",JSON.stringify(transactions));
  render();
}

function filterTransactions(){
  const category=document.getElementById("filterCategory").value;
  const month=document.getElementById("filterMonth").value;

  let filtered=JSON.parse(localStorage.getItem("transactions")) || [];

  if(category!=="All"){
    filtered=filtered.filter(t=>t.category===category);
  }

  if(month){
    filtered=filtered.filter(t=>t.date.startsWith(month));
  }

  transactions=filtered;
  render();
}

function updateChart(income,expense){
  if(chart) chart.destroy();

  chart=new Chart(document.getElementById("chart"),{
    type:"doughnut",
    data:{
      labels:["Income","Expense"],
      datasets:[{
        data:[income,expense],
        backgroundColor:["#16a34a","#dc2626"]
      }]
    }
  });
}

function exportCSV(){
  let csv="Description,Amount,Type,Category\n";
  transactions.forEach(t=>{
    csv+=`${t.desc},${t.amount},${t.type},${t.category}\n`;
  });

  const blob=new Blob([csv],{type:"text/csv"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download="transactions.csv";
  link.click();
}

function toggleDark(){
  document.body.classList.toggle("dark");
}

render();