$(function () {


    var dataSet = [
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`5421`,`Tiger`,`Nixon`)'>รายละเอียด</button>"
            , "5421", "Tiger Nixon", "ผลิต", "การผลิต", "หัวหน้าปฏิบัติงาน", "กรุงเทพ"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`1562`,`Ashton`,`Cox`)'>รายละเอียด</button>"
            , "1562", "Ashton Cox", "ธุรการ", "การประชาสัมพันธ์", "ปฏิบัติงาน", "ชลบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`6224`,`Cedric`,`Kelly`)'>รายละเอียด</button>"
            , "6224", "Cedric Kelly", "ผลิต", "การผลิต", "ปฏิบัติงาน", "นนทบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`5407`,`Airi`,`Satou`)'>รายละเอียด</button>"
            , "5407", "Airi Satou", "ธุรการ", "การผลิต", "ผู้จัดการ", "กรุงเทพ"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`4804`,`Brielle`,`Williamson`)'>รายละเอียด</button>"
            , "4804", "Brielle Williamson", "บัญชี", "การบัญชี", "หัวหน้าปฏิบัติงาน", "กรุงเทพ"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`9608`,`Herrod`,`Chandler`)'>รายละเอียด</button>"
            , "9608", "Herrod Chandler", "ผลิต", "การผลิต", "ปฏิบัติงาน", "ชลบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`6200`,`Rhona`,`Davidson`)'>รายละเอียด</button>"
            , "6200", "Rhona Davidson", "ผลิต", "การประชาสัมพันธ์", "ปฏิบัติงาน", "ปทุมธานี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`2360`,`Colleen`,`Hurst`)'>รายละเอียด</button>"
            , "2360", "Colleen Hurst", "บริหาร", "การบริหาร", "หัวหน้าปฏิบัติงาน", "นนทบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`1667`,`Sonya`,`Frost`)'>รายละเอียด</button>"
            , "1667", "Sonya Frost", "ผลิต", "การผลิต", "ปฏิบัติงาน", "ชลบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`3814`,`Jena`,`Gaines`)'>รายละเอียด</button>"
            , "3814", "Jena Gaines", "ธุรการ", "การผลิต", "หัวหน้าปฏิบัติงาน", "ปทุมธานี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`9497`,`Quinn`,`Flynn`)'>รายละเอียด</button>"
            , "9497", "Quinn Flynn", "ผลิต", "การประชาสัมพันธ์", "ปฏิบัติงาน", "นนทบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`6741`,`Charde`,`Marshall`)'>รายละเอียด</button>"
            , "6741", "Charde Marshall", "ผลิต", "การผลิต", "ผู้จัดการ", "กรุงเทพ"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`3597`,`Haley`,`Kennedy`)'>รายละเอียด</button>"
            , "3597", "Haley Kennedy", "ผลิต", "การผลิต", "ปฏิบัติงาน", "ชลบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`1965`,`Tatyana`,`Fitzpatrick`)'>รายละเอียด</button>"
            , "1965", "Tatyana Fitzpatrick", "บริหาร", "การบริหาร", "ผู้บริหาร", "ชลบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`1581`,`Michael`,`Silva`)'>รายละเอียด</button>"
            , "1581", "Michael Silva", "บัญชี", "การบัญชี", "ผู้บริหาร", "นนทบุรี"],
        ["<button type='button' class='btn btn-info  btn-sm' onclick='funcDetail(`2290`,`Caesar`,`Vance`)'>รายละเอียด</button>"
            , "2290", "Caesar Vance", "บริหาร", "การบริหาร", "ผู้จัดการ", "ชลบุรี"],
    ];

    $('.sourced-data').DataTable({
        searching: false,
    });

    $('.javascript-sourced').DataTable({
        searching: false,
        data: dataSet,
        columns: [
            { title: "" },
            { title: "รหัสพนักงาน" },
            { title: "ชื่อ - นามสกุล" },
            { title: "ฝ่าย" },
            { title: "แผนก" },
            { title: "ระดับพนักงาน" },
            { title: "สถานที่ทำงาน" }
        ],
        columnDefs: [
            {
                "targets": 0,
                "className": "text-center",
            }]
    });

});