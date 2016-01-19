angular.module('app.controllers').controller('transferPDFCtrl', function ($scope, $ionicLoading, $http, $q, $filter, $timeout, $ionicPopup) {
  $scope.csv = "entry_id,date_created,date_created,ip_address,first_name,middle_name,last_name,uh_id,permanent_address,permanent_address_line2,city,state,zip_code,Country,county,email,alt_cell_phone,home_phone,dob,birthplace,gender,citizen,permanent_resident,texas_resident,texas_continuous,ethnic_background,sibling_terry,sibling_institutions,anticipated_major,highschool_name,highschool_city,highschool_state,hs_diploma,hs_dateofgrad,hs_ged,hs_ged_date,college_info,current_college_gpa,phi_kappa_member,kappa_induction_semester,colleges_attended,online_colleges_attended,ap_transferable_hours,dc_transferable_hours,online_transferable_hours,oncampus_transferable_hours,total_transferable_hours,employment_info,employment,military_service,military_location_unit,military_active_duty,military_info2,military_mos,military_training,military_honors,military_wounded,military_gi_bill,military_gi_remain,military_gi_remain_details,hazelwood,hazelwood_remaining,hazelwood_details,leadership_info,community_service,awards_honors,first_graduate,why_apply,why_major,beyond_bachelors,life_obj,faculty_influence,transfer_lessons,additional_info,marital_status,dependents,occupation,employer,agi,edu_debt,cs_received,cs_paid,childcare_exp,partner_occupation,partner_employer,partner_agi,partner_edu_debt,partner_cs_received,partner_cs_paid,partner_childcare_exp,fin_resources,fin_support_fam,spec_circumstances,dependents_info,what,rel_claimant,father_occupation,mother_occupation,parents_agi,fin_support_rec_fam,essay,signature,date,Processed?\n\
 1,11/25/2015 13:05,,172.27.56.162,test,test,test,1234567,test,test,test,TX,test,United States,test,honors@uh.edu,(123) 456-7890,(123) 456-7891,12/31/2001,test,Female,Yes,No,Yes,Yes,Asian,Yes,test,test,test,test,test,Yes,12/23/2001,Yes,12/23/2001,0,1,Yes,test,test,test,0,0,0,0,0,Yes,test,Yes,test,Yes,test,test,test,test,Yes,Yes,Yes,test,Yes,Yes,test,test,test,test,Yes,test,test,test,test,test,test,test,Single,test,test,test,0,0,0,0,0,test,test,0,0,0,0,0,test,test,test,Yes,test,test,test,test,0,0,test.docx,http://www.uh.edu/honors/machform/machform/signature.php?q=Zm9ybV9pZD01MjEwOCZpZD0xJmVsPWVsZW1lbnRfOTQmaGFzaD01OTJmN2ExNzExOTVjYTczYjQ5MzJhZTdhNTM4ZjVkOA==,11/25/2015,";
  //get data for view
  $scope.read = function () {
    if (!$scope.csv || $scope.csv == "") {
      $ionicPopup.alert({
        title: 'Please enter CSV!',
        template: 'CSV input is required for processing.'
      });
    } else {
      $scope.loadingIndicator = $ionicLoading.show({
        content: 'Downloading data and Creating pdf ...'
      });
      $scope.header = "entry_id,date_created,date_created,ip_address,first_name,middle_name,last_name,uh_id,permanent_address,permanent_address_line2,city,state,zip_code,Country,county,email,alt_cell_phone,home_phone,dob,birthplace,gender,citizen,permanent_resident,texas_resident,texas_continuous,ethnic_background,sibling_terry,sibling_institutions,anticipated_major,highschool_name,highschool_city,highschool_state,hs_diploma,hs_dateofgrad,hs_ged,hs_ged_date,college_info,current_college_gpa,phi_kappa_member,kappa_induction_semester,colleges_attended,online_colleges_attended,ap_transferable_hours,dc_transferable_hours,online_transferable_hours,oncampus_transferable_hours,total_transferable_hours,employment_info,employment,military_service,military_location_unit,military_active_duty,military_info2,military_mos,military_training,military_honors,military_wounded,military_gi_bill,military_gi_remain,military_gi_remain_details,hazelwood,hazelwood_remaining,hazelwood_details,leadership_info,community_service,awards_honors,first_graduate,why_apply,why_major,beyond_bachelors,life_obj,faculty_influence,transfer_lessons,additional_info,marital_status,dependents,occupation,employer,agi,edu_debt,cs_received,cs_paid,childcare_exp,partner_occupation,partner_employer,partner_agi,partner_edu_debt,partner_cs_received,partner_cs_paid,partner_childcare_exp,fin_resources,fin_support_fam,spec_circumstances,dependents_info,what,rel_claimant,father_occupation,mother_occupation,parents_agi,fin_support_rec_fam,essay,signature,date,Processed?";
      $scope.csv_internal = "";
      $scope.csv_line_array = $scope.csv.split("\n");
      $scope.csv_internal = $scope.csv_internal + $scope.header;

      delete $scope.csv_line_array[0];
      //delete $scope.csv_line_array[1];
      //delete $scope.csv_line_array[2];
      //delete $scope.csv_line_array[3];
      //delete $scope.csv_line_array[4];
      //delete $scope.csv_line_array[5];
      //delete $scope.csv_line_array[6];
      //delete $scope.csv_line_array[7];
      //delete $scope.csv_line_array[8];
      //delete $scope.csv_line_array[9];
      //delete $scope.csv_line_array[10];
      //delete $scope.csv_line_array[11];
      //delete $scope.csv_line_array[12];

      $scope.csv_line_array.forEach(function (line) {
        $scope.csv_internal = $scope.csv_internal + "\n" + line;
      });
      $scope.inputJSON = $.csv.toObjects($scope.csv_internal);

      var signatureLoading = [];
      $scope.inputJSON.forEach(function (item) {
        signatureLoading.push($scope.getSignature(item.signature, function (cb) {
          item.agreement = cb;
        }));
      });

      $q.all(signatureLoading).then(function () {
        $ionicLoading.hide();
      })
    }
  };

  $scope.downloadAll = function () {
    $scope.loadingIndicator = $ionicLoading.show({
      content: 'Downloading data and Creating pdf ...'
    });
    var pdfList = [];
    $scope.inputJSON.forEach(function (item) {
      var pdfObj = {};
      pdfObj.pdf = $scope.createTransferPdf(item);
      pdfObj.item = item;
      pdfList.push(pdfObj);
    });

    $scope.generateMultiplePDF(pdfList).then(function (pdfBinaryArray) {
      pdfBinaryArray.forEach(function (pdf) {
        var link = document.createElement("a");
        link.download = pdf.item.last_name + pdf.item.first_name;
        link.href = pdf.pdf;
        link.click();
      });
      $ionicLoading.hide();
    });
  };

  $scope.generatePDF = function (item) {
    pdfMake.createPdf($scope.createTransferPdf(item)).download(item.last_name + item.first_name);
  };

  $scope.generateMultiplePDF = function (objects) {
    var retObjects = [];
    angular.forEach(objects, function (pdfObject, index) {
      var deferred = $q.defer();
      pdfMake.createPdf(pdfObject.pdf).getDataUrl(function (slipPdfObject) {
        var pdfObj = {};
        pdfObj.pdf = angular.copy(slipPdfObject);
        pdfObj.item = pdfObject.item;
        deferred.resolve(pdfObj);
      });
      retObjects.push(deferred.promise);
    });
    return $q.all(retObjects);
  };

  $scope.getSignature = function (url, callback) {
    var deferred2 = $q.defer();
    var sigpad_options = {
      drawOnly: true,
      displayOnly: true,
      bgColour: '#fff',
      penColour: '#000',
      validateFields: false
    };

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var responseArray = xhr.response.split('\n');
      responseArray.forEach(function (responseLine) {
        if (responseLine.indexOf("var sigpad_data = ") > 0) {
          eval(responseLine);
          $('#mf_sigpad').signaturePad(sigpad_options).regenerate(sigpad_data);
          deferred2.resolve("loaded");
          callback($("canvas")[0].getContext("2d").canvas.toDataURL());
        }
      });
    };
    xhr.open('GET', url);
    xhr.send();

    return deferred2.promise;
  };

  // callback for ng-click 'createPdf':
  $scope.createTransferPdf = function (item_input) {
    var item = angular.copy(item_input);
    console.log(item);
    //load all list data

    //put NAs for all NULL values
    for (var key in item) {
      if (item.hasOwnProperty(key) && (item[key] == null || item[key] == "")) {
        item[key] = "N/A";
      }
    }

    //after loading individual lists, we are ready to create the actual pdf
    //define font to use in pdf
    pdfMake.fonts = {
      TimesNewRoman: {
        normal: 'Times-New-Roman-Regular.ttf',
        bold: 'Times-New-Roman-Bold.ttf',
        italics: 'Times-New-Roman-Italic.ttf',
        bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
      }
    };

    return createTransferDocument(item);
  };

  $scope.read();

  function createTransferDocument(item) {
    return {
      styles: {
        header: {
          margin: [40, 30, 40, 10],
          fontSize: 10
        },
        title: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        subtitle: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        chapterheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 10]
        },
        sub: {
          bold: true,
          margin: [0, 10, 0, 5]
        },
        label: {
          margin: [0, 0, 0, 10]
        },
        field: {
          decoration: 'underline',
          margin: [5, 0, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        notes: {
          italics: true,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        notes_small: {
          fontSize: 10,
          italics: true,
          bold: true,
          margin: [0, 5, 0, 5]
        }
      },
      defaultStyle: {
        font: 'TimesNewRoman'
      },
      header: function (currentPage, pageCount) {
        return {
          style: 'header',
          columns: [
            {
              text: 'STUDENT NAME:'
            },
            {
              text: [item.first_name, ' ', item.last_name]
            },
            {
              text: 'UH ID:',
              width: 'auto'
            },
            {
              text: item.uh_id.toString(),
              style: 'field'
            },
            {
              text: 'Page ' + currentPage.toString(),
              alignment: 'right'
            }
          ]
        };
      },
      footer: {
        margin: [0, 20, 0, 0],
        text: 'The Honors College ~ MD Anderson Library 4333 University Dr #212 ~ Houston, TX 77204-2001 ~ 713.743.9010',
        alignment: 'center'
      },
      content: [
        {
          text: 'University of Houston',
          style: 'title'
        },
        {
          text: 'Terry Foundation Scholarship Program Application \n 2016-2017',
          style: 'subtitle'
        },
        {
          text: 'I. STUDENT INFORMATION (PERSONAL DATA)',
          style: 'chapterheader'
        },
        {
          columns: [
            {
              text: 'Legal Name:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.last_name, ', ', item.first_name, ', ', item.middle_name],
              alignment: 'center'
            },
            {
              text: '7-digit-UH ID:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.uh_id.toString()],
              style: 'field'
            }
          ]
        },
        {
          alignment: 'left',
          fontSize: 8,
          margin: [0, -10, 0, 5],
          text: '\t\t\t\t                             \t\t\t\t\t (Last, First, Middle)'
        },
        {
          columns: []
        },
        {
          columns: [
            {
              text: 'Permanent Address:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.permanent_address],
              style: 'field'
            },
            {
              text: 'Address Line 2:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.permanent_address_line2],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'City:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.city],
              style: 'field'
            },
            {
              text: 'State:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.state],
              style: 'field'
            },
            {
              text: 'Zip Code:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.zip_code.toString()],
              style: 'field'
            },
            {
              text: 'County:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.county.toString()],
              style: 'field',
              width: 'auto'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Cell Phone:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.alt_cell_phone.toString()],
              style: 'field'
            },
            {
              text: 'Home/Alternate Phone:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.home_phone.toString()],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Date of Birth:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.dob],
              style: 'field'
            },
            {
              text: 'Gender:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.gender],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Email Address:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.email],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'U.S.Citizen?',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.citizen],
              style: 'field'
            },
            {
              text: 'Permanent Resident?',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.permanent_resident],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Texas Resident?',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.texas_resident],
              style: 'field'
            },
            {
              text: 'Birthplace:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.birthplace],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Racial/Ethnic Background:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.ethnic_background],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Intended Major at UH:',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.anticipated_major],
              style: 'field'
            }
          ]
        },
        {
          text: 'II.  HIGH SCHOOL INFORMATION',
          style: 'chapterheader'
        },
        {
          columns: [
            {
              text: 'High School Name:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.highschool_name],
              style: 'field'
            },
            {
              text: 'High School City/ST:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.highschool_city + ", " + item.highschool_state],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'High School Diploma:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hs_diploma],
              style: 'field'
            },
            {
              text: 'EGraduation Date:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hs_dateofgrad],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'High School GED:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hs_ged],
              style: 'field'
            },
            {
              text: 'GED Date:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hs_ged_date],
              style: 'field'
            }
          ]
        },
        {
          pageBreak: 'after',
          text: ''
        },
        {
          text: 'III.  College Information',
          style: 'chapterheader'
        },
        {
          columns: [
            {
              text: 'Colleges or Universities attended if currently enrolled, hours in progress:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.college_info],
              style: 'field'
            },
            {
              text: 'Cumulative GPA:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.current_college_gpa],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Are you a member of Phi Theta Kappa?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.phi_kappa_member],
              style: 'field'
            },
            {
              text: 'If "Yes," semester inducted:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.kappa_induction_semester],
              style: 'field'
            }
          ]
        },
        {
          text: 'List the following information for all Colleges or Universities you have physically attended (Institution name, city and state in which the institution is located, semesters of attendance, hours attempted, hours completed, and cumulative GPA at the institution):',
          style: 'label',
          width: 'auto'
        },
        {
          text: [item.colleges_attended],
          style: 'field'
        },
        {
          text: 'List the following information for all online Colleges or Universities you have attended (Institution name, city and state, semesters of attendance, hours attempted,hours completed, and cumulative GPA at the institution):',
          style: 'label',
          width: 'auto'
        },
        {
          text: [item.online_colleges_attended],
          style: 'field'
        },
        {
          columns: [
            {
              text: 'AP hours:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.ap_transferable_hours],
              style: 'field'
            },
            {
              text: 'Dual Credit hours:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.dc_transferable_hours],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'On-line transferable hours:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.online_transferable_hours],
              style: 'field'
            },
            {
              text: 'On Campus transferable hours:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.oncampus_transferable_hours],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Total Transferable Hours:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.total_transferable_hours],
              style: 'field'
            },
            {
              text: '',
              style: 'label',
              width: '35%'
            },
            {
              text: [""],
              style: 'field'
            }
          ]
        },
        {
          pageBreak: 'after',
          text: ''
        },
        {
          text: 'III.  ACTIVITIES, AWARDS, AND EMPLOYMENT',
          style: 'chapterheader'
        },
        {
          columns: [
            {
              text: 'Are you currently employed?',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.employment_info],
              style: 'field'
            },
            {
              text: '',
              style: 'label',
              width: 'auto'
            },
            {
              text: [""],
              style: 'field'
            }
          ]
        },
        {
          text: 'Employment',
          style: 'notes'
        },
        {
          margin: [0, 0, 0, 5],
          text: ['List the following information for your current and previous jobs or internships, beginning with the most recent: Position/Job Title, Employer, Hours per week, Dates of Employment']
        },
        {
          text: [item.employment],
          alignment: 'left',
          style: 'field'
        },
        {
          text: 'Military service',
          style: 'notes'
        },
        {
          columns: [
            {
              text: 'Are you currently serving in the Reserves or National Guard?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.military_service],
              style: 'field'
            },
            {
              text: 'If "Yes," please provide unit and location.',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.military_location_unit],
              style: 'field'
            }
          ]
        },
        {
          text: 'Have you previously served on active duty in a uniformed service of the United States?',
          style: 'label',
          width: 'auto'
        },
        {
          text: [item.military_active_duty],
          style: 'field'
        },
        {
          text: 'If "Yes," please provide the following information: Service Branch, Dates of Service, Active or Reserve, Current Status, Station Location(s) + Dates',
          style: 'label',
          width: 'auto'
        },
        {
          text: [item.military_info2],
          style: 'field'
        },
        {
          columns: [
            {
              text: 'List all Military Occupation Specialties attained:',
              style: 'label',
              width: '50%'
            },
            {
              text: 'Additional specialized training received',
              style: 'label',
              width: '50%'
            }
          ]
        },
        {
          columns: [
            {
              text: [item.military_mos],
              style: 'field',
              width: '50%'
            },
            {
              text: [item.military_training],
              style: 'field',
              width: '50%'
            }
          ]
        },
        {
          text: 'List all medals, honors, and awards received relating to Military Service:',
          style: 'label'
        },
        {
          text: [item.military_honors],
          style: 'field'
        },
        {
          columns: [
            {
              text: 'Are you a Wounded Warrior?',
              style: 'label',
              width: 'auto'
            },
            {
              text: [item.military_wounded],
              style: 'field'
            },
            {
              text: '',
              style: 'label',
              width: 'auto'
            },
            {
              text: [""],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Have you previously utilized GI Bill education benefits?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.military_gi_bill],
              style: 'field'
            },
            {
              text: 'Are you entitled to Hazelwood Act benefits?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hazelwood],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'If "Yes," do you have any GI Bill education benefits remaining?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.military_gi_remain],
              style: 'field'
            },
            {
              text: 'If "Yes," do you have have any Hazelwood Act benefits remaining?',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hazelwood_remaining],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'If "Yes," provide details:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.military_gi_remain_details],
              style: 'field'
            },
            {
              text: 'If "Yes," provide details:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.hazelwood_details],
              style: 'field'
            }
          ]
        },
        {
          pageBreak: 'after',
          text: ''
        },
        {
          text: 'III.  EMPLOYMENT, ACTIVITIES, SERVICE AND AWARDS (continued)',
          style: 'chapterheader'
        },
        {
          text: 'Leadership Activities',
          style: 'notes'
        },
        {
          margin: [0, 0, 0, 5],
          text: 'In chronological order, include the following information for up to six extracurricular activities or organizations in which you are most involved: \n Organization/Activity, Position(s) Held, Description of Activity, Total Hours, Months and Years Participated'
        },
        {
          text: [item.leadership_info],
          alignment: 'left',
          style: 'field'
        },
        {
          text: 'Church, Community, and Volunteer Service',
          style: 'notes'
        },
        {
          margin: [0, 0, 0, 5],
          text: 'In chronological order, include the following information for up to six church-related, community service, civic organizations, or other activities in which you are most involved: \n Place/Name of Service, Positions Held, Description of Service, Total Hours, Months and Years Participated'
        },
        {
          text: [item.community_service],
          alignment: 'left',
          style: 'field'
        },
        {
          text: 'Awards, Special Honors, and Distinctions',
          style: 'notes'
        },
        {
          margin: [0, 0, 0, 5],
          text: [{
            text: 'In order of importance to you',
            bold: true
          }, ', list up to six major awards, honors, or distinctions that you received: \n Award/Honor/Distinction, Description or Basis of Acknowledgement, Level of Competition, Date(s) ']
        },
        {
          text: [item.awards_honors],
          alignment: 'left',
          style: 'field'
        },
        {
          pageBreak: 'after',
          text: ''
        },
        {
          text: 'IV.  COLLEGE PLANS',
          style: 'chapterheader'
        },
        {
          text: 'Why have you chosen to apply to the University of Houston?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.why_apply]
        },
        {
          text: 'Why have you chosen your academic major(s)?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.why_major]
        },
        {
          text: 'Briefly describe any educational plans beyond earning your Bachelor\'s degree?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.beyond_bachelors]
        },
        {
          text: 'What are some of your life\'s goals and objectives?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.life_obj]
        },
        {
          text: 'Has there been a particularly influential faculty member or personal contact that has been instrumental in your decision to attend the University of Houston? If so, please relate:',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.faculty_influence]
        },
        {
          text: 'Transfer/non-traditional students often tell us that their prior experience has taught them lessons that helped them to be successful. What lessons have you learned that you would like to pass on to other students?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.transfer_lessons]
        },
        {
          text: 'Is there any additional information that you consider important for the committee to know in evaluating your application for scholarship consideration?',
          style: 'label'
        },
        {
          style: 'field',
          text: [item.additional_info]
        },
        {
          pageBreak: 'after',
          text: ''
        },
        {
          text: 'V.  FINANCIAL INFORMATION',
          style: 'chapterheader'
        },
        {
          text: 'To be considered for a Terry Foundation Scholarship, applicants must file a completed Free Application for Federal Student Aid (FAFSA) with the U.S. Department of Education and indicate the University of Houston (school code: 003652) as a report recipient.  FAFSA forms can be submitted on-line after January 1st at www.fafsa.ed.gov.  You must file your FAFSA no later than February 26th. You must complete the FAFSA or your application cannot be processed.'
        },
        {
          text: 'Please complete all questions or your application cannot be considered.  Financial information may be subject to verification from tax returns or other sources.  ',
          style: 'notes'
        },
        {
          table: {
            widths: ['*', '*'],
            headerRows: 0,
            body: [
              [
                {
                  columns: [
                    {
                      text: 'Your marital status:',
                      width: 'auto',
                      style: 'label'
                    },
                    {
                      text: [item.marital_status],
                      alignment: 'left',
                      style: 'field'
                    }
                  ]
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          text: 'Please provide the following information for all dependents (spouse, children or stephchildren, parents, others) who reside with you or to whom you are obligated to provide support for: \n Name, Age, Relationship, Year in College (if applicable), Reside with you? (yes/no)'
        },
        {
          text: [item.dependents],
          style: 'field',
          width: 'auto',
          margin: [5, 0, 0, 5]
        },
        {
          text: 'Were you or will you be listed as a dependent on someone else\'s tax return for 2015?'
        },
        {
          text: [item.dependents_info],
          style: 'field',
          width: 'auto',
          margin: [5, 0, 0, 5]
        },
        {
          text: 'If "Yes," to the above question, complete the following:'
        },
        {
          columns: [
            {
              text: 'Name of claimant:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.what],
              style: 'field'
            },
            {
              text: 'Relationship of claimant:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.rel_claimant],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Father/Stepfather occupation:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.father_occupation],
              style: 'field'
            },
            {
              text: 'Mother/Stepmother occupation:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.mother_occupation],
              style: 'field'
            }
          ]
        },
        {
          text: 'Your parent(s)\', stepparent(s)\', or gaurdians\' Adjusted Gross Income for 2015:',
          style: 'label'
        },
        {
          text: [item.parents_agi],
          style: 'field'
        },
        {
          text: 'Amount of financial support received by you from family (not your partner) in 2015:',
          style: 'label'
        },
        {
          text: [item.fin_support_rec_fam],
          style: 'field'
        },
        {
          columns: [
            {
              text: 'Your occupation',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.occupation],
              style: 'field'
            },
            {
              text: 'Partner\'s occupation:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_occupation],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your employer:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.employer],
              style: 'field'
            },
            {
              text: 'Partner\'s employer:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_employer],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your Annual Gross Income:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.agi],
              style: 'field'
            },
            {
              text: 'Partner\'s Annual Gross Income:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_agi],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your educational debt to date:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.edu_debt],
              style: 'field'
            },
            {
              text: 'Partner\'s educational debt to date:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_edu_debt],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your monthly child support received:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.cs_received],
              style: 'field'
            },
            {
              text: 'Partner\'s monthly child support received:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_cs_received],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your monthly child support payment:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.cs_paid],
              style: 'field'
            },
            {
              text: 'Partner\'s monthly child support payment:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_cs_paid],
              style: 'field'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Your monthly childcare expenses:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.childcare_exp],
              style: 'field'
            },
            {
              text: 'Partner\'s monthly childcare expenses:',
              style: 'label',
              width: '35%'
            },
            {
              text: [item.partner_childcare_exp],
              style: 'field'
            }
          ]
        },
        {
          margin: [0, 0, 0, 5],
          text: 'Do you have a sibling who is a current/past Terry Scholar or who is applying for a Terry Scholarship?'
        },
        {
          text: [item.sibling_terry],
          style: 'field'
        },
        {
          margin: [0, 0, 0, 5],
          text: 'If you answered yes to the above, please provide name(s) and institution(s):'
        },
        {
          text: [item.sibling_institutions],
          style: 'field'
        },
        {
          text: 'VII.  AGREEMENT',
          style: 'chapterheader',
          pageBreak: 'before'
        },
        {
          margin: [0, 0, 0, 5],
          text: 'With the electronic signature below, I certify that the information I have provided is complete and correct to the best of my knowledge. If my application is accepted, I agree to abide by the policies, rules, and regulations of the Terry Foundation. I authorize the University of Houston and the Terry Foundation to verify the information I have provided. I further understand that this information will be relied upon by the Terry Foundation in determining my financial eligibility and that the submission of false information is grounds for rejection of my application and/or withdrawal of an offer of scholarship.'
        },
        {
          margin: [0, 0, 0, 5],
          image: item.agreement
        }
      ],
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60]
    };
  }
});
