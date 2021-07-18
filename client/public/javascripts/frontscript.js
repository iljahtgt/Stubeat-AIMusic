function MemDelete(id) {
  var data = { id: id };
  console.log(data);
  $.ajax({
    type: "post",
    url: "http://localhost:1337/api/memdelete",
    data: JSON.stringify(data),
    contentType: "application/json;charset=utf-8",
  })
    .done(function () {
      alert("delete!");
      location.reload();
    })
    .fail(function (err) {
      console.log(err);
    });
}

function MemEdit(id, username) {
  // console.log(id,username);
  var catchid = document.getElementById("saveMid");
  var catchname = document.getElementById("updateMemname");
  catchid.value = id;
  catchname.value = username;
}

function QueryMember() {
  var id = $("#searchMem").val();
  // console.log(id);
  window.location.href = "/admin/memberctl/?id=" + id;
}

function Memmusic(id) {
  console.log(id);
  window.location.href = "/admin/memberctl/mmusic/?id=" + id;
}

function MusDelete(id) {
  var data = { musicid: id };
  // console.log(data);
  $.ajax({
    type: "post",
    url: "http://localhost:1337/api/musdelete",
    data: JSON.stringify(data),
    contentType: "application/json;charset=utf-8",
  })
    .done(function () {
      alert("delete!");
      location.reload();
    })
    .fail(function (err) {
      console.log(err);
    });
}

function MusEdit(musicid) {
  //console.log(musname);
  //console.log(musicid);
  var catchmusicid = document.getElementById("musicID");
  catchmusicid.value = musicid;
}

function EmpDelete(id) {
  var data = { id: id };
  console.log(data);
  $.ajax({
    type: "post",
    url: "http://localhost:1337/api/EmpDelete",
    data: JSON.stringify(data),
    contentType: "application/json;charset=utf-8",
  })
    .done(function () {
      alert("delete!");
      location.reload();
    })
    .fail(function (err) {
      console.log(err);
    });
}

function EmpEdit(id, empname) {
  // console.log(id,empname);
  var catchid = document.getElementById("saveMid");
  var catchname = document.getElementById("updateEmpname");
  catchid.value = id;
  catchname.value = empname;
}

function QueryEmp() {
  var id = $("#searchEmp").val();
  // console.log(id);
  window.location.href = "/admin/empctl/?id=" + id;
}
