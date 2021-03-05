var _ApiTnsd = {
  // _TnsdUrl: 'https://scsmartconnect.com/StandardCanApi/api/projectTrainingSchedule',
  _TnsdUrl: 'http://101.101.201.200/StandardCanApi/api/projectTrainingSchedule',
  // _TnsdUrl: 'http://localhost:26442/api/projectTrainingSchedule',
  _TnsdData: {
    _TnsdParams: {
      _method: '',
      _id: ''
    },
    _TnsdPC: {},
    _TnsdEP: {},
    _TnsdEPT: {},
    _TnsdDtt: {},
    _TnsdEmp: {}
  },
  _TnsdTrainList: {
    _List: [],
    _Counter: 0
  }
};



var _fomular = null;

function initailData(method, dataId) {
  // $("#btnReCal").confirm();

 
  $('#TnsdModalProgress').modal('hide');

  _ApiTnsd = {
    // _TnsdUrl: 'https://scsmartconnect.com/StandardCanApi/api/projectTrainingSchedule',
    _TnsdUrl: 'http://101.101.201.200/StandardCanApi/api/projectTrainingSchedule',
    _TnsdData: {
      _TnsdParams: {
        _method: '',
        _id: ''
      },
      _TnsdPC: {},
      _TnsdEP: {},
      _TnsdEPT: {},
      _TnsdDtt: {},
      _TnsdEmp: {}
    },
    _TnsdTrainList: {
      _List: [],
      _Counter: 0
    }
  };

  // alert(method);

  _ApiTnsd._TnsdData._TnsdParams._method = method;
  _ApiTnsd._TnsdData._TnsdParams._id = dataId;
}

function funcAddCourse() {
  $('#TnsdModalAddCourse').modal('show');
  TnsdPopSearchCourse();
};

function funcConfirmAddCourse() {
  for (var a = 0; a < _ApiTnsd._TnsdData._TnsdPC.length; a++) {
    if ($('#TnsdAC' + a).is(':checked')) {

      var data = _ApiTnsd._TnsdData._TnsdPC[a],
        counter = _ApiTnsd._TnsdTrainList._Counter;

      var btnDelete = 'TnsdDeleteMainTable(' + counter + ')';

      var row = '<tr>';
      row += '    <td class="text-center">' + data.course_name + '</td>';
      row += '    <td class="text-center">' + data.course_type + '</td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainDestination' + counter + '">-</font> <a onclick="TnsdGetDTT(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainExpert' + counter + '">-</font> <a onclick="TnsdGetEPT(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainPrice' + counter + '">0.00</font> <a onclick="TnsdGetEP(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <button type="button" class="btn btn-info btn-sm" onclick="TnsdGetEmpInCourse(' + counter + ')">ผู้เข้าร่วม</button>';
      row += '        <button type="button" class="btn btn-warning btn-sm" onclick="TnsdGetEmpScore(' + counter + ')">ผลคะแนน</button>';
      row += '        <button type="button" class="btn btn-danger btn-sm" onclick="' + btnDelete + '">ยกเลิก</button>';
      row += '    </td>';
      row += '</tr>';

      $('#TnsdMainTable tbody').append(row);

      _ApiTnsd._TnsdTrainList._List.push({
        course_id: data.id,
        course_name: data.course_name,
        course_type: data.course_type,
        destination_id: null,
        destination_name: '',
        expert_list: [],
        expert_name: '',
        expense_list: [],
        expense_total: 0,
        item_date: '',
        time_start: '',
        time_stop: '',
        emp_list: []
      });

      _ApiTnsd._TnsdTrainList._Counter++;

    }
  }
  $('#TnsdModalAddCourse').modal('hide');
};

function TnsdDeleteMainTable(line) {
  $('#TnsdModalConfirmId').val(line);

  $('#TnsdModalConfirm').modal('show');
}

function TnsdDeleteMainTableConfirm() {

  var line = $('#TnsdModalConfirmId').val();

  var data = _ApiTnsd._TnsdTrainList._List,
    loop = _ApiTnsd._TnsdTrainList._List.length,
    tempData = [],
    counter = 0;
  $('#TnsdMainTable > tbody').html('');
  for (var a = 0; a < loop; a++) {
    if (a != line) {
      var btnDelete = 'TnsdDeleteMainTable(' + counter + ')';
      var row = '<tr>';
      row += '    <td class="text-center">' + data[a].course_name + '</td>';
      row += '    <td class="text-center">' + data[a].course_type + '</td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainDestination' + counter + '">-</font> <a onclick="TnsdGetDTT(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainExpert' + counter + '">-</font> <a onclick="TnsdGetEPT(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainPrice' + counter + '">0.00</font> <a onclick="TnsdGetEP(' + counter + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <button type="button" class="btn btn-info btn-sm" onclick="TnsdGetEmpInCourse(' + counter + ')">ผู้เข้าร่วม</button>';
      row += '        <button type="button" class="btn btn-warning btn-sm" onclick="TnsdGetEmpScore(' + counter + ')">ผลคะแนน</button>';
      row += '        <button type="button" class="btn btn-danger btn-sm" onclick="' + btnDelete + '">ยกเลิก</button>';
      row += '    </td>';
      row += '</tr>';
      counter++;
      tempData.push(data[a]);
      $('#TnsdMainTable tbody').append(row);

    }
  }

  _ApiTnsd._TnsdTrainList._List = tempData;
  _ApiTnsd._TnsdTrainList._Counter = counter;

  $('#TnsdModalConfirm').modal('hide');

}

function funcSetExpense() {
  var index = $('#TnscExpenseId').val(),
    data = [],
    loop = _ApiTnsd._TnsdData._TnsdEP.length,
    total = 0;


  for (var a = 0; a < loop; a++) {
    var id = _ApiTnsd._TnsdData._TnsdEP[a].id,
      value = $('#TnscAEPValue' + a).val();

    value = value == '' ? '0' : value;
    debugger;

    data.push({
      expense_id: id,
      expense_price: value
    });
    total += parseFloat(value);
  }

  debugger;
  _ApiTnsd._TnsdTrainList._List[index].expense_list = [];
  _ApiTnsd._TnsdTrainList._List[index].expense_list = data;
  _ApiTnsd._TnsdTrainList._List[index].expense_total = total;
  $('#TnsdMainPrice' + index).html(total);
  $('#TnscModalExpense').modal('hide');
}

function TnsdGetEP(line) {

  if (_ApiTnsd._TnsdTrainList._List[line].expense_list.length > 0)
    var loop = _ApiTnsd._TnsdTrainList._List[line].expense_list.length;
  else
    var loop = _ApiTnsd._TnsdData._TnsdEP.length;

  for (var a = 0; a < loop; a++) {

    var id = (_ApiTnsd._TnsdTrainList._List[line].expense_list.length > 0 ? _ApiTnsd._TnsdTrainList._List[line].expense_list[a].expense_id : 0);
    var value = (_ApiTnsd._TnsdTrainList._List[line].expense_list.length > 0 ? _ApiTnsd._TnsdTrainList._List[line].expense_list[a].expense_price : 0);

    $('#TnscAEPId' + a).val(id);
    $('#TnscAEPValue' + a).val(value);

  }


  $('#TnscExpenseId').val(line);
  $('#TnscModalExpense').modal('show');

}

function TnsdGetMaster() {
  // $('#TnsdProgressTxt').html('กำลังเตรียมพร้อมระบบ');
  $('#TnsdModalProgress').modal('show');
  var params = { method: 'master', user_id: '' };
  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);
}

function TnsdSetMaster(ele) {

  debugger;

  var project = ele.project_name,
    project_length = ele.project_name.length,
    expense = ele.project_expense,
    expense_length = ele.project_expense.length,
    depart = ele.depart,
    depart_length = ele.depart.length,
    opt;

  _ApiTnsd._TnsdData._TnsdEP = expense;

  $('#TnsdPACProject').html('');
  $('#TnsdEmpInCourseDept').html('');

  debugger;

  opt = '<option value="" selected >ทั้งหมด</option>';
  $('#TnsdPACProject').append(opt);
  $('#TnsdEmpInCourseDept').append(opt);

  for (var a = 0; a < project_length; a++) {
    opt = '<option value="' + project[a].code + '">' + project[a].text + '</option>';
    $('#TnsdPACProject').append(opt);
  }

  debugger;

  for (var a = 0; a < depart_length; a++) {
    opt = '<option value="' + depart[a].value + '">' + depart[a].text + '</option>';
    $('#TnsdEmpInCourseDept').append(opt);
  }

  debugger;

  $('#TnscExpenseTable > tbody').html('');

  for (var a = 0; a < expense_length; a++) {

    var row = '<tr>';
    row += '<td class="text-left">' + expense[a].expense_name + '</td>';
    row += '<td class="text-left">';
    row += '<input type="hidden" value="' + expense[a].id + '" id="TnscAEPId' + a + '" class="form-control"> ';
    row += '<input type="number" value="0" id="TnscAEPValue' + a + '" class="form-control"> ';
    row += '</td>';
    row += '</tr>';

    $('#TnscExpenseTable tbody').append(row);

  }

  debugger;

  opt = '<option value="" selected disabled>--</option>';
  $('#TnsdEmpScoreSTimeH').append(opt);
  $('#TnsdEmpScoreSTimeM').append(opt);
  $('#TnsdEmpScoreETimeH').append(opt);
  $('#TnsdEmpScoreETimeM').append(opt);

  debugger;

  for (var a = 1; a <= 24; a++) {
    opt = '<option value="' + TnsdPad(a, 2) + '">' + TnsdPad(a, 2) + '</option>';
    $('#TnsdEmpScoreSTimeH').append(opt);
    $('#TnsdEmpScoreETimeH').append(opt);
  }

  debugger;

  for (var a = 0; a <= 59; a++) {
    opt = '<option value="' + TnsdPad(a, 2) + '">' + TnsdPad(a, 2) + '</option>';
    $('#TnsdEmpScoreSTimeM').append(opt);
    $('#TnsdEmpScoreETimeM').append(opt);
  }

  debugger;
 
  if (_ApiTnsd._TnsdData._TnsdParams._method == 'detail')
  {
    // alert("detail");
    TnsdGetDetail();
  }else{
    $('#TnsdModalProgress').modal('hide');
  }
    

}

function TnsdPad(str, max) {
  str = str.toString();
  return str.length < max ? TnsdPad("0" + str, max) : str;
}

function TnsdPopSearchCourse() {

  $('#TnsdModalAddCourseProgress').show();
  $('#TnsdModalAddCourseTable').hide();
  $('#TnsdBtnConfirmAddCourse').hide();

  var params = {
    method: 'searchCourse',
    searchCourse_project: $('#TnsdPACProject').val(),
    searchCourse_name: $('#TnsdPACCourse').val(),
    user_id: ''
  }

  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);

}

function TnsdSetPopSearchCourse(ele) {

  // alert("search course 99");

  $('#TnsdAddCourseTable > tbody').html('');

  _ApiTnsd._TnsdData._TnsdPC = ele;

  var data = ele,
    loop = ele.length,
    row;

  for (var i = 0; i < loop; i++) {

    row = '<tr>';
    row += '<td class="text-center"><input type="checkbox" id="TnsdAC' + i + '"></td>';
    row += '<td class="text-left">' + data[i].course_name + '</td>';
    row += '<td class="text-left">' + data[i].course_type + '</td>';
    row += '</tr>';

    $('#TnsdAddCourseTable tbody').append(row);

  }

  $('#TnsdModalAddCourseProgress').hide();
  $('#TnsdModalAddCourseTable').show();
  $('#TnsdBtnConfirmAddCourse').show();

}

function TnsdGetEPT(line) {
  $('#TnsdAddExpertIndex').val(line);
  $('#TnsdModalAddExpert').modal('show');
  TnsdPopSearchExpert();
}

function TnsdPopSearchExpert() {

  $('#TnsdModalAddExpertProgress').show();
  $('#TnsdModalAddExpertTable').hide();
  $('#TnsdBtnConfirmAddExpert').hide();

  var params = {
    method: 'searchExpert',
    searchExpert_name: $('#TnsdPACExpertName').val(),
    user_id: ''
  }

  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);

}

function TnsdSetEPT(ele) {

  $('#TnsdAddExpertTable > tbody').html('');

  _ApiTnsd._TnsdData._TnsdEPT = ele;

  var data = ele,
    loop = ele.length;

  for (var i = 0; i < loop; i++) {

    row = '<tr>';
    row += '<td class="text-center"><input type="checkbox" id="TnsdAEPT' + i + '"></td>';
    row += '<td class="text-left">' + data[i].name + '</td>';
    row += '</tr>';

    $('#TnsdAddExpertTable tbody').append(row);

  }

  $('#TnsdModalAddExpertProgress').hide();
  $('#TnsdModalAddExpertTable').show();
  $('#TnsdBtnConfirmAddExpert').show();

}

function funcConfirmAddExpert() {
  debugger;

  var str_name = '',
    list_name = [],
    data = [],
    loop = _ApiTnsd._TnsdData._TnsdEPT.length,
    index = $('#TnsdAddExpertIndex').val();

  debugger;

  for (var a = 0; a < loop; a++) {
    debugger;
    if ($('#TnsdAEPT' + a).is(':checked')) {
      debugger;
      data.push({ expert_id: _ApiTnsd._TnsdData._TnsdEPT[a].id });
      list_name.push(_ApiTnsd._TnsdData._TnsdEPT[a].name);
    }
  }

  debugger;
  for (var b = 0; b < list_name.length; b++) {
    str_name += list_name[b];
    if (b != list_name.length - 1)
      str_name += ', ';
  }

  debugger;
  _ApiTnsd._TnsdTrainList._List[index].expert_list = [];
  _ApiTnsd._TnsdTrainList._List[index].expert_list = data;
  _ApiTnsd._TnsdTrainList._List[index].expert_name = str_name;

  $('#TnsdMainExpert' + index).html(str_name);
  $('#TnsdModalAddExpert').modal('hide');
}

function TnsdGetDTT(line) {
  $('#TnsdAddDestinationIndex').val(line);
  $('#TnsdModalAddDestination').modal('show');
  TnsdPopSearchDestination();
}

function TnsdPopSearchDestination() {

  $('#TnsdModalAddDestinationProgress').show();
  $('#TnsdModalAddDestinationTable').hide();
  $('#TnsdBtnConfirmAddDestination').hide();

  var params = {
    method: 'searchDestination',
    searchDestination_name: $('#TnsdPACDestinationName').val(),
    user_id: ''
  }

  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);

}

function TnsdSetDTT(ele) {

  $('#TnsdAddDestinationTable > tbody').html('');

  _ApiTnsd._TnsdData._TnsdDtt = ele;

  var data = ele,
    loop = ele.length;

  for (var i = 0; i < loop; i++) {

    var btnSelect = "TnsdSelectDTT(" + data[i].id + ",'" + data[i].name + "')";

    row = '<tr>';
    row += '<td class="text-left">' + data[i].name + '</td>';
    row += '<td class="text-center"><button type="button" class="btn btn-primary btn-sm" onclick="' + btnSelect + '">เลือก</button></td>';
    //row += '<td class="text-center"><input type="radio" id="TnsdADTT'+i+'" name="TnsdADTT"></td>';
    row += '</tr>';

    $('#TnsdAddDestinationTable tbody').append(row);

  }

  $('#TnsdModalAddDestinationProgress').hide();
  $('#TnsdModalAddDestinationTable').show();
  $('#TnsdBtnConfirmAddDestination').show();

}

function TnsdSelectDTT(id, name) {

  debugger;

  var index = $('#TnsdAddDestinationIndex').val();
  _ApiTnsd._TnsdTrainList._List[index].destination_id = id;
  _ApiTnsd._TnsdTrainList._List[index].destination_name = name;

  $('#TnsdMainDestination' + index).html(name);
  $('#TnsdModalAddDestination').modal('hide');

}

function TnsdGetEmpInCourse(line) {

  var course = _ApiTnsd._TnsdTrainList._List[line].course_name;
  var temp_data = _ApiTnsd._TnsdTrainList._List[line].emp_list;
  var temp_loop = _ApiTnsd._TnsdTrainList._List[line].emp_list.length;

  $('#TnsdEmpInCourseTitle').html('<i class="ft-plus"></i> พนักงานในหลักสูตร : ' + course);
  $('#TnsdEmpInCourseIndex').val(line);
  $('#TnsdModalEmpInCourse').modal('show');

  $('#TnsdEmpInCourseTableSelect > tbody').html('');

  if (temp_loop > 0) {
    for (var a = 0; a < temp_loop; a++) {

      var onc_dltemp = 'TnsdEmpInCourseDelete(' + a + ')';

      var row = '<tr>';
      // row += '    <td class="text-left">' + course + '</td>';
      row += '    <td class="text-left">' + temp_data[a].depart + '</td>';
      row += '    <td class="text-left">' + temp_data[a].emp_name + '</td>';
      row += '    <td class="text-left">' + (temp_data[a].emp_tel == null ? "" : temp_data[a].emp_tel) + '</td>';
      // row += '    <td class="text-center">' + temp_data[a].emp_email + '</td>';
      row += '    <td class="text-center">';
      row += '        <a class="danger delete mr-1" onclick="' + onc_dltemp + '"><i class="fas fa-trash-alt"></i></a>';
      row += '    </td>';
      row += '</tr>';

      $('#TnsdEmpInCourseTableSelect tbody').append(row);
    }
  }

  // TnsdSearchEmpInCourse('master');

}

function funckeypressEmpInCourseFixed(event) {
  var strcode = (event.keyCode ? event.keyCode : event.which);
  if (strcode == '13') {
    TnsdSearchEmpInCourse('fixed');
  }
}

function TnsSearchFomular(course_id) {

  var params = {
    method: 'searchFomular',
    course_id: course_id,
    user_id: ''
  }
  // alert(params);

  $.ajax({
    type: 'POST',
    url: _ApiTnsd._TnsdUrl,
    data: params,
    dataType: 'json',
    success: function (response) {

      // console.log("xxx");
      _fomular = response.data;

      console.log(response.data);

    }
  });


}

function TnsdSearchEmpInCourse(ff) {

  // var test = _ApiTnsd._TnsdTrainList._List[0].emp_list;
  // console.log(test);
  // var result = test.find(x => x.emp_code === '62129');
  // if (result == null)
  //   alert("null");
  // else
  //   alert("find");

  // console.log(result);
  // return;

  if (ff == 'fixed') {
    var params = {
      method: 'searchEmp',
      searchEmp_code: $('#TnsdEmpInCourseFixed').val(),
      searchEmp_name: '',
      search_depart: '',
      user_id: ''
    }
  }
  else {
    var params = {
      method: 'searchEmp',
      searchEmp_code: $('#TnsdEmpInCourseEmpCode').val(),
      searchEmp_name: $('#TnsdEmpInCourseEmpName').val(),
      searchEmp_depart: $('#TnsdEmpInCourseDept').val(),
      user_id: ''
    }
  }

  console.log(params);

  $.ajax({
    type: 'POST',
    url: _ApiTnsd._TnsdUrl,
    data: params,
    dataType: 'json',
    success: function (response) {

      _ApiTnsd._TnsdData._TnsdEP = response;

      if (ff == 'fixed') {
        if (response.length > 0) {

          var index = $('#TnsdEmpInCourseIndex').val();
          var course = _ApiTnsd._TnsdTrainList._List[index].course_name;
          var data = response[0];

          var result = _ApiTnsd._TnsdTrainList._List[index].emp_list.find(x => x.emp_code === data.emp_code);
          if (result != null) // แสดงว่าเคยมีอยู่แล้ว
            return;

          var no = _ApiTnsd._TnsdTrainList._List[index].emp_list.length;
          var onc_dltemp = 'TnsdEmpInCourseDelete(' + no + ')';

          var row = '<tr>';
          // row += '    <td class="text-left">' + course + '</td>';
          row += '    <td class="text-left">' + data.depart + '</td>';
          row += '    <td class="text-left">' + data.emp_code + ' ' + data.emp_name + '</td>';
          row += '    <td class="text-left">' + (data.emp_tel == null ? "" : data.emp_tel) + '</td>';
          // row += '    <td class="text-center">' + data.emp_email + '</td>';
          row += '    <td class="text-center">';
          row += '        <a class="danger delete mr-1" onclick="' + onc_dltemp + '"><i class="fas fa-trash-alt"></i></a>';
          row += '    </td>';
          row += '</tr>';

          _ApiTnsd._TnsdTrainList._List[index].emp_list.push({
            emp_code: data.emp_code,
            depart: data.depart,
            emp_name: data.emp_code + ' ' + data.emp_name,
            emp_tel: data.emp_tel,
            emp_email: data.emp_email,
            emp_score1: '',
            emp_score2: '',
            emp_score3: '',
            emp_score4: '',
            emp_score5: '',
            emp_score_total: '',
            emp_result: ''
          });

          $('#TnsdEmpInCourseTableSelect tbody').append(row);

        }
      }
      else {

        $('#TnsdEmpInCourseTableSearch > tbody').html('');

        if (response.length > 0) {

          var data = response,
            loop = response.length,
            row;

          for (var a = 0; a < loop; a++) {

            var onc_sltemp = 'TnsdEmpInCourseSelect(' + a + ')';

            row = '<tr>';
            row += '    <td class="text-left">' + data[a].depart + '</td>';
            row += '    <td class="text-left">' + data[a].emp_code + ' ' + data[a].emp_name + '</td>';
            row += '    <td class="text-left">' + (data[a].emp_tel == null ? "" : data[a].emp_tel) + '</td>';
            // row += '    <td class="text-center">' + data[a].emp_email + '</td>';
            row += '    <td class="text-center" style="padding: 5px !important;">';
            row += '        <button type="button" class="btn btn-info btn-sm" onclick="' + onc_sltemp + '">';
            row += '            เลือก >>';
            row += '        </button>';
            row += '    </td>';
            row += '</tr>';

            $('#TnsdEmpInCourseTableSearch tbody').append(row);

          }

        }

      }

    }
  });
}

function TnsdEmpInCourseSelect(line) {

  var index = $('#TnsdEmpInCourseIndex').val();
  var course = _ApiTnsd._TnsdTrainList._List[index].course_name;
  var data = _ApiTnsd._TnsdData._TnsdEP[line];
  var no = _ApiTnsd._TnsdTrainList._List[index].emp_list.length;
  var onc_dltemp = 'TnsdEmpInCourseDelete(' + no + ')';

  var result = _ApiTnsd._TnsdTrainList._List[index].emp_list.find(x => x.emp_code === data.emp_code);
  if (result != null) // แสดงว่าเคยมีอยู่แล้ว
    return;

  var row = '<tr>';
  // row += '    <td class="text-left">' + course + '</td>';
  row += '    <td class="text-left">' + data.depart + '</td>';
  row += '    <td class="text-left">' + data.emp_code + ' ' + data.emp_name + '</td>';
  row += '    <td class="text-left">' + (data.emp_tel == null ? "" : data.emp_tel) + '</td>';
  // row += '    <td class="text-center">' + data.emp_email + '</td>';
  row += '    <td class="text-center">';
  row += '        <a class="danger delete mr-1" onclick="' + onc_dltemp + '"><i class="fas fa-trash-alt"></i></a>';
  row += '    </td>';
  row += '</tr>';

  _ApiTnsd._TnsdTrainList._List[index].emp_list.push({
    emp_code: data.emp_code,
    depart: data.depart,
    emp_name: data.emp_code + ' ' + data.emp_name,
    emp_tel: data.emp_tel,
    emp_email: data.emp_email,
    emp_score1: '',
    emp_score2: '',
    emp_score3: '',
    emp_score4: '',
    emp_score5: '',
    emp_score_total: '',
    emp_result: ''
  });

  $('#TnsdEmpInCourseTableSelect tbody').append(row);

}

function TnsdEmpInCourseDelete(line) {

  var index = $('#TnsdEmpInCourseIndex').val();
  var course = _ApiTnsd._TnsdTrainList._List[index].course_name;

  var temp_data = _ApiTnsd._TnsdTrainList._List[index].emp_list;
  var temp_loop = _ApiTnsd._TnsdTrainList._List[index].emp_list.length;
  var new_data = [];

  $('#TnsdEmpInCourseTableSelect > tbody').html('');

  for (var a = 0; a < temp_loop; a++) {
    if (a != line) {

      var onc_dltemp = 'TnsdEmpInCourseDelete(' + a + ')';

      var row = '<tr>';
      // row += '    <td class="text-left">' + course + '</td>';
      row += '    <td class="text-left">' + temp_data[a].depart + '</td>';
      row += '    <td class="text-left">' + temp_data[a].emp_name + '</td>';
      row += '    <td class="text-left">' + (temp_data[a].emp_tel == null ? "" : temp_data[a].emp_tel) + '</td>';
      // row += '    <td class="text-center">' + temp_data[a].emp_email + '</td>';
      row += '    <td class="text-center">';
      row += '        <a class="danger delete mr-1" onclick="' + onc_dltemp + '"><i class="fas fa-trash-alt"></i></a>';
      row += '    </td>';
      row += '</tr>';

      new_data.push(temp_data[a]);

      $('#TnsdEmpInCourseTableSelect tbody').append(row);

    }
  }

  _ApiTnsd._TnsdTrainList._List[index].emp_list = new_data;

}

function TnsdGetEmpScore(line) {

  var course = _ApiTnsd._TnsdTrainList._List[line].course_name;
  var course_id = _ApiTnsd._TnsdTrainList._List[line].course_id;

  TnsSearchFomular(course_id);


  $('#TnsdEmpScoreIndex').val(line);
  $('#TnsdEmpScordTitle').html('บันทึกคะแนนในหลักสูตร : ' + course);
  $('#TnsdModalEmpScore').modal('show');

  if (_ApiTnsd._TnsdData._TnsdParams._method == 'detail') {

    $('#TnsdEmpScoreDate').val(_ApiTnsd._TnsdTrainList._List[line].item_date);
    var STime = _ApiTnsd._TnsdTrainList._List[line].time_start.split(':');
    var SEime = _ApiTnsd._TnsdTrainList._List[line].time_stop.split(':');

    $('#TnsdEmpScoreSTimeH').val(STime[0]);
    $('#TnsdEmpScoreSTimeM').val(STime[1]);
    $('#TnsdEmpScoreETimeH').val(SEime[0]);
    $('#TnsdEmpScoreETimeM').val(SEime[1]);

  }

  var dataEmp = _ApiTnsd._TnsdTrainList._List[line].emp_list,
    dataEmpLoop = _ApiTnsd._TnsdTrainList._List[line].emp_list.length,
    row;

  $('#TnsdEmpScoreList > tbody').html('');

  for (var a = 0; a < dataEmpLoop; a++) {

    var score1 = (dataEmp[a].emp_score1 == '' || dataEmp[a].emp_score1 == null ? 0 : dataEmp[a].emp_score1),
      score2 = (dataEmp[a].emp_score2 == '' || dataEmp[a].emp_score2 == null ? 0 : dataEmp[a].emp_score2),
      score3 = (dataEmp[a].emp_score3 == '' || dataEmp[a].emp_score3 == null ? 0 : dataEmp[a].emp_score3),
      score4 = (dataEmp[a].emp_score4 == '' || dataEmp[a].emp_score4 == null ? 0 : dataEmp[a].emp_score4),
      score5 = (dataEmp[a].emp_score5 == '' || dataEmp[a].emp_score5 == null ? 0 : dataEmp[a].emp_score5),
      emp_result = (dataEmp[a].emp_result == '' || dataEmp[a].emp_result == null ? '' : dataEmp[a].emp_result),
      scoreT = (dataEmp[a].emp_score_total == '' || dataEmp[a].emp_score_total == null ? 0 : dataEmp[a].emp_score_total);

    row = '<tr>';
    row += '    <td class="text-left">' + dataEmp[a].emp_name + '</td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="number" value="' + score1 + '" id="TnsdScore' + a + '1" onchange="TnsdCalScore(' + a + ')" class="form-control text-right">';
    row += '    </td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="number" value="' + score2 + '" id="TnsdScore' + a + '2" onchange="TnsdCalScore(' + a + ')" class="form-control text-right">';
    row += '    </td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="number" value="' + score3 + '" id="TnsdScore' + a + '3" onchange="TnsdCalScore(' + a + ')" class="form-control text-right">';
    row += '    </td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="number" value="' + score4 + '" id="TnsdScore' + a + '4" onchange="TnsdCalScore(' + a + ')" class="form-control text-right">';
    row += '    </td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="number" value="' + score5 + '" id="TnsdScore' + a + '5" onchange="TnsdCalScore(' + a + ')" class="form-control text-right">';
    row += '    </td>';
    row += '    <td class="text-right" style="padding:5px !important">';
    row += '        <input type="text" value="' + scoreT + '" id="TnsdScoreT' + a + '" class="form-control text-right" readonly>';
    row += '    </td>';
    row += '    <td class="text-center" style="padding:5px !important"><input type="text" value="' + emp_result + '" id="TnsdScoreResult' + a + '" class="form-control text-center" readonly></td>';
    row += '</tr>';

    $('#TnsdEmpScoreList tbody').append(row);

  }

}


function TnsdReCalScore(line) {



  var index = $('#TnsdEmpScoreIndex').val();
  var item_count = _ApiTnsd._TnsdTrainList._List[index].emp_list.length;
  for (var i = 0; i < item_count; i++) {
    var line = i.toString();

    var score1 = parseFloat(isNullRetString0($('#TnsdScore' + line + '1').val()));
    var score2 = parseFloat(isNullRetString0($('#TnsdScore' + line + '2').val()));
    var score3 = parseFloat(isNullRetString0($('#TnsdScore' + line + '3').val()));
    var score4 = parseFloat(isNullRetString0($('#TnsdScore' + line + '4').val()));
    var score5 = parseFloat(isNullRetString0($('#TnsdScore' + line + '5').val()));
    var total = score1 + score2 + score3 + score4 + score5;

    var result = '-';
    var temp = _fomular.find(x => total <= x.value);
    $('#TnsdScoreT' + line).val(total);
    var s_result = '-';

    if (temp != null && temp.text != null) {
      s_result = temp.text;
    }
    $('#TnsdScoreResult' + line).val(s_result);

    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score1 = score1;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score2 = score2;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score3 = score3;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score4 = score4;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score5 = score5;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score_total = total;
    _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_result = s_result;

  }

  // alert(item_count);


  // var score1 = parseFloat(isNullRetString0($('#TnsdScore' + line + '1').val()));
  // var score2 = parseFloat(isNullRetString0($('#TnsdScore' + line + '2').val()));
  // var score3 = parseFloat(isNullRetString0($('#TnsdScore' + line + '3').val()));
  // var score4 = parseFloat(isNullRetString0($('#TnsdScore' + line + '4').val()));
  // var score5 = parseFloat(isNullRetString0($('#TnsdScore' + line + '5').val()));
  // var total = score1 + score2 + score3 + score4 + score5;

  // var result = '-';
  // var temp = _fomular.find(x => total <= x.value);
  // console.log("cal fomular");
  // console.log(temp);

  // $('#TnsdScoreT' + line).val(total);
  // var s_result = '-';

  // if (temp != null && temp.text != null){
  //   s_result = temp.text;
  // }

  // $('#TnsdScoreResult'+ line).val(s_result);

  // var index = $('#TnsdEmpScoreIndex').val();

  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score1 = score1;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score2 = score2;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score3 = score3;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score4 = score4;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score5 = score5;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score_total = total;
  // _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_result = s_result;

}

function TnsdCalScore(line) {


  var score1 = parseFloat(isNullRetString0($('#TnsdScore' + line + '1').val()));
  var score2 = parseFloat(isNullRetString0($('#TnsdScore' + line + '2').val()));
  var score3 = parseFloat(isNullRetString0($('#TnsdScore' + line + '3').val()));
  var score4 = parseFloat(isNullRetString0($('#TnsdScore' + line + '4').val()));
  var score5 = parseFloat(isNullRetString0($('#TnsdScore' + line + '5').val()));
  var total = score1 + score2 + score3 + score4 + score5;

  var result = '-';
  var temp = _fomular.find(x => total <= x.value);
  console.log("cal fomular");
  console.log(temp);

  $('#TnsdScoreT' + line).val(total);
  var s_result = '-';

  if (temp != null && temp.text != null) {
    s_result = temp.text;
  }

  $('#TnsdScoreResult' + line).val(s_result);

  var index = $('#TnsdEmpScoreIndex').val();

  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score1 = score1;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score2 = score2;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score3 = score3;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score4 = score4;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score5 = score5;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_score_total = total;
  _ApiTnsd._TnsdTrainList._List[index].emp_list[line].emp_result = s_result;

}

function isNullRetString0(value) {
  var ret = '0';
  try {
    ret = value == '' || value == null ? '0' : value;
  } catch (e) {

  }
  return ret;
}

function TnsdEmpScordSetData() {

  var index = $('#TnsdEmpScoreIndex').val(),
    start_time = '',
    stop_time = '';

  if ($('#TnsdEmpScoreSTimeH').val() != '' && $('#TnsdEmpScoreSTimeM').val() != '')
    start_time = $('#TnsdEmpScoreSTimeH').val() + ':' + $('#TnsdEmpScoreSTimeM').val();

  if ($('#TnsdEmpScoreETimeH').val() != '' && $('#TnsdEmpScoreETimeM').val() != '')
    stop_time = $('#TnsdEmpScoreETimeH').val() + ':' + $('#TnsdEmpScoreETimeM').val();

  _ApiTnsd._TnsdTrainList._List[index].item_date = $('#TnsdEmpScoreDate').val();
  _ApiTnsd._TnsdTrainList._List[index].time_start = start_time;
  _ApiTnsd._TnsdTrainList._List[index].time_stop = stop_time;

}

function TnsdValidateSaveData() {

  if ($('#TnsdTname').val() == '') {
    $('#TnsdErrorTxt').html('กรุณาใส่ชื่อรอบการอบรม');
    $('#TnsdModalError').modal('show');
    return false;
  }

  if ($('#TnsdDateFrom').val() == '' || $('#TnsdDateTo').val() == '') {
    $('#TnsdErrorTxt').html('กรุณาใส่วันที่อบรม');
    $('#TnsdModalError').modal('show');
    return false;
  }

  var TnsdTrainList_data = _ApiTnsd._TnsdTrainList._List,
    TnsdTrainList_loop = _ApiTnsd._TnsdTrainList._List.length,
    TnsdErrorTxt = '',
    TnsdError = false;


  if (TnsdTrainList_loop <= 0) {
    $('#TnsdErrorTxt').html('กรุณาเพิ่มหลักสูตร');
    $('#TnsdModalError').modal('show');
    return false;
  }

  console.log(TnsdTrainList_data);

  for (var a = 0; a < TnsdTrainList_loop; a++) {

    if (TnsdTrainList_data[a].destination_id == '' || TnsdTrainList_data[a].destination_id == null) {
      TnsdErrorTxt = 'หลักสูตร ' + TnsdTrainList_data[a].course_name + ' กรุณาเลือกสถานที่อบรม';
      TnsdError = true;
      break;
    }
    else if (TnsdTrainList_data[a].expert_list.length <= 0) {
      TnsdErrorTxt = 'หลักสูตร ' + TnsdTrainList_data[a].course_name + ' กรุณาเลือกวิทยากร';
      TnsdError = true;
      break;
    }
    else if (TnsdTrainList_data[a].emp_list.length <= 0) {
      // TnsdErrorTxt = 'หลักสูตร ' + TnsdTrainList_data[a].course_name + ' กรุณาเลือกผู้เข้าร่วม';
      // TnsdError = true;
      // break;
    }
    else {
      TnsdErrorTxt = '',
        TnsdError = false;
    }

  }

  if (TnsdError) {
    $('#TnsdErrorTxt').html(TnsdErrorTxt);
    $('#TnsdModalError').modal('show');
    return false;
  }

  return true;

}

function funcSave() {
  if (!TnsdValidateSaveData())
    return 0;

  // $('#TnsdProgressTxt').html('ระบบกำลังบันทึกข้อมูล');
  $('#TnsdModalProgress').modal('show');

  if (_ApiTnsd._TnsdData._TnsdParams._method == 'create')
    var api_method = 'insert';
  else
    var api_method = 'update';

  var params = {
    method: api_method,
    training_name: $('#TnsdTname').val(),
    date_form: $('#TnsdDateFrom').val(),
    date_to: $('#TnsdDateTo').val(),
    training_status: $('#TnsdTstatus').val(),
    user_id: '',
    training_item: []
  }

  var TnsdTrainList_data = _ApiTnsd._TnsdTrainList._List,
    TnsdTrainList_loop = _ApiTnsd._TnsdTrainList._List.length,
    tempList = [];

  for (var a = 0; a < TnsdTrainList_loop; a++) {

    tempData = {
      course_id: TnsdTrainList_data[a].course_id,
      destination_id: TnsdTrainList_data[a].destination_id,
      item_date: TnsdTrainList_data[a].item_date,
      time_start: TnsdTrainList_data[a].time_start,
      time_stop: TnsdTrainList_data[a].time_stop,
      expert_list: TnsdTrainList_data[a].expert_list,
      expense_list: TnsdTrainList_data[a].expense_list,
      emp_list: []
    }

    var TnsdEmpList_data = _ApiTnsd._TnsdTrainList._List[a].emp_list,
      TnsdEmpList_loop = _ApiTnsd._TnsdTrainList._List[a].emp_list.length;

    for (var b = 0; b < TnsdEmpList_loop; b++) {
      tempData.emp_list.push({
        emp_code: TnsdEmpList_data[b].emp_code,
        emp_score1: TnsdEmpList_data[b].emp_score1,
        emp_score2: TnsdEmpList_data[b].emp_score2,
        emp_score3: TnsdEmpList_data[b].emp_score3,
        emp_score4: TnsdEmpList_data[b].emp_score4,
        emp_score5: TnsdEmpList_data[b].emp_score5,
        emp_score_total: TnsdEmpList_data[b].emp_score_total,
        emp_result: TnsdEmpList_data[b].emp_result
      });
    }

    tempList.push(tempData);

  }

  if (_ApiTnsd._TnsdData._TnsdParams._method == 'detail')
    params.training_id = _ApiTnsd._TnsdData._TnsdParams._id;

  params.training_item = tempList;
  console.log("funcsave");
  console.log(params);
  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);
}

function TnsdGetDetail() {

  // $('#TnsdProgressTxt').html('ระบบกำลังดึงข้อมูลรายละเอียดรอบอบรม');
  // $('#TnsdModalProgress').modal('show');

  var params = {
    method: 'trainingDetail',
    training_id: _ApiTnsd._TnsdData._TnsdParams._id,
    user_id: ''
  }

  TnsdCallApi(_ApiTnsd._TnsdUrl, params.method, params);

}

function TnsdSetDetail(ele) {

  $('#TnsdModalProgress').modal('hide');

  var data = ele.data;

  console.log("load_detail");
  console.log(data);

  debugger;

  $('#TnsdTname').val(data.training_name);
  $('#TnsdDateFrom').val(data.date_form);
  $('#TnsdDateTo').val(data.date_to);
  $('#TnsdTstatus').val(data.training_status);

  $('#TnsdMainTable > tbody').html('');

  if (data.training_item.length > 0) {

    debugger;

    var item_data = data.training_item,
      item_loop = data.training_item.length,
      row;

    for (var a = 0; a < item_loop; a++) {

      _ApiTnsd._TnsdTrainList._List.push({
        course_id: item_data[a].course_id,
        course_name: item_data[a].course_name,
        course_type: item_data[a].course_type,
        destination_id: item_data[a].destination_id,
        destination_name: item_data[a].destination_name,
        expert_list: [],
        expert_name: '',
        expense_list: [],
        expense_total: item_data[a].expense_total,
        item_date: item_data[a].item_date,
        time_start: item_data[a].time_start,
        time_stop: item_data[a].time_stop,
        emp_list: []
      });

      _ApiTnsd._TnsdTrainList._Counter++;

      if (item_data[a].expense_list.length > 0)
        _ApiTnsd._TnsdTrainList._List[a].expense_list = item_data[a].expense_list;

      if (item_data[a].expert_list.length > 0) {

        var expert_name = '';

        for (var b = 0; b < item_data[a].expert_list.length; b++) {

          _ApiTnsd._TnsdTrainList._List[a].expert_list.push({
            expert_id: item_data[a].expert_list[b].expert_id
          });

          expert_name += item_data[a].expert_list[b].expert_name;

          if (b != item_data[a].expert_list.length - 1)
            expert_name += ',';

        }
      }
      else
        var expert_name = '';

      debugger;

      if (item_data[a].emp_list.length > 0) {
        for (var b = 0; b < item_data[a].emp_list.length; b++) {
          _ApiTnsd._TnsdTrainList._List[a].emp_list.push({
            emp_code: item_data[a].emp_list[b].emp_code,
            depart: item_data[a].emp_list[b].emp_depart,
            emp_name: item_data[a].emp_list[b].emp_name,
            emp_tel: item_data[a].emp_list[b].emp_tel,
            emp_email: item_data[a].emp_list[b].emp_email,
            emp_score1: item_data[a].emp_list[b].emp_score1,
            emp_score2: item_data[a].emp_list[b].emp_score2,
            emp_score3: item_data[a].emp_list[b].emp_score3,
            emp_score4: item_data[a].emp_list[b].emp_score4,
            emp_score5: item_data[a].emp_list[b].emp_score5,
            emp_score_total: item_data[a].emp_list[b].emp_score_total,
            emp_result: item_data[a].emp_list[b].emp_result
          });
        }
      }

      debugger;

      console.log(_ApiTnsd._TnsdTrainList);

      var btnDelete = 'TnsdDeleteMainTable(' + a + ')';

      var row = '<tr>';
      row += '    <td class="text-center">' + item_data[a].course_name + '</td>';
      row += '    <td class="text-center">' + item_data[a].course_type + '</td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainDestination' + a + '">' + item_data[a].destination_name + '</font> <a onclick="TnsdGetDTT(' + a + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainExpert' + a + '">' + expert_name + '</font> <a onclick="TnsdGetEPT(' + a + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <font id="TnsdMainPrice' + a + '">' + item_data[a].expense_total + '</font> <a onclick="TnsdGetEP(' + a + ')"';
      row += '            class="primary edit mr-1"><i class="fas fa-pencil-alt"></i></a>';
      row += '    </td>';
      row += '    <td class="text-center">';
      row += '        <button type="button" class="btn btn-info btn-sm" onclick="TnsdGetEmpInCourse(' + a + ')">ผู้เข้าร่วม</button>';
      row += '        <button type="button" class="btn btn-warning btn-sm" onclick="TnsdGetEmpScore(' + a + ')">ผลคะแนน</button>';
      row += '        <button type="button" class="btn btn-danger btn-sm" onclick="' + btnDelete + '">ยกเลิก</button>';
      row += '    </td>';
      row += '</tr>';

      $('#TnsdMainTable tbody').append(row);

    }

  }

  debugger;

  $('#TnsdModalProgress').modal('hide');

  // alert("hide");
  $('.modal-backdrop').hide();

}

function TnsdCallApi(link, method, dataset) {

  console.log(method);

  $.ajax({
    type: 'POST',
    url: link,
    data: dataset,
    dataType: 'json',
    success: function (response) {

      console.log("search result");

      if (method == 'master') {
        // console.log("ok");
        // $('#TnsdModalProgress').modal('hide');
        // $('#TnsdModalProgress').modal('hide');
        TnsdSetMaster(response);
      }
      else if (method == 'searchCourse')
        TnsdSetPopSearchCourse(response);
      else if (method == 'searchExpert')
        TnsdSetEPT(response);
      else if (method == 'searchDestination')
        TnsdSetDTT(response);
      else if (method == 'trainingDetail') {
        // alert("trainingDetail");
        TnsdSetDetail(response);
      }
      else
        TnsdResponse(method, response);
    }
  });
}

function TnsdResponse(method, response) {

  debugger;
  $('#TnsdModalProgress').modal('hide');

  if (response.status == 'S') {
    if (method == 'insert') {
      //http://localhost:4200/#/projectplan/project-training-schedule-detail/14
      // var link = '#/projectplan/project-training-schedule-detail?method=detail&id=' + response.value;
      var link = '#/projectplan/project-training-schedule-detail/' + response.value + '';
      window.location = link;
      // location.href = link;
    }
    else if (method == 'update') {
      // var link = '#/projectplan/project-training-schedule-detail?method=detail&id=' + _ApiTnsd._TnsdData._TnsdParams._id;
      var link = '#/projectplan/project-training-schedule-detail/' + _ApiTnsd._TnsdData._TnsdParams._id + '';
      location.href = link;
    }
  }
  else {
    $('#TnsdErrorTxt').html(response.message);
    $('#TnsdModalError').modal('show');
  }

}

