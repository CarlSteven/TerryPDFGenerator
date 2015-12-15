angular.module('app.controllers', [])

  .controller('terryApplicationPDFCtrl', function ($scope, $ionicLoading, $http, $q, $filter, $timeout, $ionicPopup) {
    //get data for view
    $scope.read = function () {
      if (!$scope.csv || $scope.csv == "") {
        $ionicPopup.alert({
          title: 'Please enter CSV!',
          template: 'CSV input is required for processing.'
        });
      }

      $scope.header = "entry_id,date_created,date_created,ip_address,first_name,middle_name,last_name,uh_id,permanent_address,permanent_address_line2,city,state,zip_code,Country,county,email,alt_cell_phone,home_phone,dob,birthplace,gender,citizen,permanent_resident,texas_resident,ethnic_background,sibling_terry,sibling_institutions,first_graduate,anticipated_major,highschool_name,highschool_city,hs_state,highschool_councelor_first,highschool_councelor_last,highschool_phone,highschool_phone_ext,highschool_councelor_email,highschool_graduation_date,highschool_gpa,highschool_scale,highschool_rank,highschool_rank_tied,highschool_rank_out,sat_reading,sat_math,sat_composite,sat_date,act_composite,act_date,national_merit,national_achievement,national_hispanic,employment,community_service,extracurriculars,awards_honors,why_apply,top_six,why_major,marital_status,total_annual_income,present_partner,marital_status_parents,dependent,texas_tomorrow_fund,father_occupation,father_employer,father_total_income,father_level_education,mother_occupation,mother_employer,mother_total_income,mother_level_education,stepparent_occupation,stepparent_employer,stepparent_total_income,stepparent_level_education,guardian_occupation,guardian_employer,guardian_total_income,guardian_level_education,income_same,increased,members_attending,financial_assistance,assistance_type,funds_saved_you,funds_saved_others,total_savings,total_investments,net_value,projected_support,adjusted_cross_income,under_25,scholarship_will_receive,scholarship_have_applied,description_special_circumstances,Upload Essays and Resume:,agreement,Date,Processed?";
      $scope.csv_internal = "";
      $scope.csv_line_array = $scope.csv.split("\n");
      $scope.csv_internal = $scope.csv_internal + $scope.header;

      delete $scope.csv_line_array[0];
      delete $scope.csv_line_array[1];
      delete $scope.csv_line_array[2];
      delete $scope.csv_line_array[3];
      delete $scope.csv_line_array[4];
      delete $scope.csv_line_array[5];
      delete $scope.csv_line_array[6];
      delete $scope.csv_line_array[7];
      delete $scope.csv_line_array[8];
      delete $scope.csv_line_array[9];
      delete $scope.csv_line_array[10];
      delete $scope.csv_line_array[11];
      delete $scope.csv_line_array[12];

      $scope.csv_line_array.forEach(function (line) {
        $scope.csv_internal = $scope.csv_internal + "\n" + line;
      });
      $scope.inputJSON = $.csv.toObjects($scope.csv_internal);
    };

    $scope.generatePDF = function (item) {
      console.log(item);
      $scope.createPdf(item);
    };

    var coursework = [],
      employment = [],
      activity = [],
      volunteer = [],
      award = [],
      university = [],
      child = [],
      scholarship = [];

    // callback for ng-click 'createPdf':
    $scope.createPdf = function (item) {

      //load all list data
      $scope.loadingIndicator = $ionicLoading.show({
        content: 'Downloading data and Creating pdf ...'
      });

      var listPromises = [];

      //TODO use filter
      //clean data
      if (item.citizen !== undefined) {
        if (item.citizen === 'true') {
          item.citizen = 'Yes';
          item.permanent_resident = 'N/A';
          item.permanent_resident_card = 'N/A';
        } else {
          item.citizen = 'No';
          if (item.permanent_resident !== undefined) {
            if (item.permanent_resident === 'true') {
              item.permanent_resident = 'Yes';
              if (item.permanent_resident_card !== undefined) {
                if (item.permanent_resident_card) {
                  item.permanent_resident_card = '1551';
                } else {
                  item.permanent_resident_card = '1551C';
                }
              }
            } else {
              item.permanent_resident = 'No';
            }
          }
        }
      }

      if (item.texas_resident !== undefined) {
        if (item.texas_resident === 'true') {
          item.texas_resident = 'Yes';
        } else {
          item.texas_resident = 'No';
        }
      }

      if (item.first_graduate !== undefined) {
        if (item.first_graduate === 'true') {
          item.first_graduate = 'Yes';
        } else {
          item.first_graduate = 'No';
        }
      }

      if (item.texas_tomorrow_fund !== undefined) {
        if (item.texas_tomorrow_fund === 'true') {
          item.texas_tomorrow_fund = 'Yes';
        } else {
          item.texas_tomorrow_fund = 'No';
        }
      }

      //put NAs for all NULL values
      for (var key in item) {
        if (item.hasOwnProperty(key) && (item[key] == null || item[key] == "")) {
          item[key] = "N/A";
        }
      }

      //after loading individual lists, we are ready to create the actual pdf
      $q.all(listPromises).then(function () {
        //define font to use in pdf
        pdfMake.fonts = {
          TimesNewRoman: {
            normal: 'Times-New-Roman-Regular.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italic.ttf',
            bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
          }
        };

        var docDefinition = createDocument(item);

        $timeout(function () {
          $ionicLoading.hide();
        }, 200);
        //try {
        pdfMake.createPdf(docDefinition).open();
        //} catch (err) {
        //  console.error(err);
        //}
      });
    };

    //support functions for pdf creation
    function buildTableBody(data, columns, headers, emptyRows) {
      var body = [],
        i,
        j,
        headerRow = [];

      for (i = 0; i < headers.length; i++) {
        headerRow.push({
          text: headers[i],
          fillColor: 'lightgrey'
        });
      }

      // body.push(headers);
      body.push(headerRow);

      if (emptyRows === undefined) {
        emptyRows = 3;
      }

      if (data !== undefined) {

        data.forEach(function (row) {
          var dataRow = [];

          columns.forEach(function (column) {
            dataRow.push(row[column].toString());
          });

          body.push(dataRow);
        });

        emptyRows = emptyRows - data.length;
        if (emptyRows < 0) {
          emptyRows = 0;
        }
      }

      for (i = 0; i < emptyRows; i++) {
        var dataRow = [];
        for (j = 0; j < columns.length; j++) {
          dataRow.push(' ');
        }

        body.push(dataRow);
      }

      return body;
    }

    //support functions for pdf creation
    function buildTableWidth(widths) {
      var width = [],
        i;

      for (i = 0; i < widths.length; i++) {
        width.push(widths[i]);
      }

      return width;
    }

    //support functions for pdf creation
    function table(data, columns, headers, widths, emptyRows, filter) {
      if (filter !== undefined) {
        data = $filter('filter')(data, {
          level: filter
        }, true);
      }
      return {
        table: {
          widths: buildTableWidth(widths),
          margin: [10, 10, 10, 10],
          headerRows: 1,
          body: buildTableBody(data, columns, headers, emptyRows),
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            }

            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; }
          }
        }
      };
    }

    function createDocument(item) {
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
                width: 'auto'
              },
              {
                text: [item.highschool_name],
                style: 'field'
              },
              {
                text: 'High School City/ST:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_city + ", " + item.hs_state],
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Name of Counselor:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_councelor_first + " " + item.highschool_councelor_last],
                style: 'field'
              },
              {
                text: 'Counselor Phone/Ext.:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_phone],
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Counselor’s Email Address:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_councelor_email],
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'High School GPA:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_gpa.toString()],
                style: 'field'
              },
              {
                text: 'Scale:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_scale.toString()],
                style: 'field'
              },
              {
                text: 'Expected Graduation Date:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_graduation_date],
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Class Rank:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_rank.toString()],
                style: 'field',
                width: 'auto'
              },
              {
                text: ['out of ' + item.highschool_rank_out.toString() + ' students'],
                style: 'field'
              },
              {
                text: 'Number of students tied for this rank:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.highschool_rank_tied.toString()],
                style: 'field',
                pageBreak: 'after'
              }
            ]
          },
          {
            text: 'II.  HIGH SCHOOL INFORMATION (continued)',
            style: 'chapterheader'
          },
          {
            text: 'Test Scores',
            style: 'sub'
          },
          {
            table: {
              widths: [20, 100, 50, 20, 70, 70],
              headerRows: 0,
              body: [
                [
                  {
                    text: 'SAT',
                    bold: 'true'
                  },
                  {
                    text: 'Critical Reading:',
                    alignment: 'right'
                  },
                  {
                    text: [item.sat_reading.toString()],
                    alignment: 'left',
                    style: 'field'
                  },
                  {
                    text: 'ACT',
                    bold: 'true',
                    alignment: 'right'
                  },
                  {
                    text: 'Composite:',
                    alignment: 'right'
                  },
                  {
                    text: [item.act_composite.toString()],
                    alignment: 'left',
                    style: 'field'
                  }
                ],
                [
                  {
                    text: ''
                  },
                  {
                    text: 'Mathematics:',
                    alignment: 'right'
                  },
                  {
                    text: [item.sat_math.toString()],
                    alignment: 'left',
                    style: 'field'
                  },
                  {
                    text: ''
                  },
                  {
                    text: 'Date of Test:',
                    alignment: 'right'
                  },
                  {
                    text: [item.act_date],
                    alignment: 'left',
                    style: 'field'
                  }
                ],
                [
                  {
                    text: ''
                  },
                  {
                    text: 'Composite:',
                    alignment: 'right'
                  },
                  {
                    text: [item.sat_composite.toString()],
                    alignment: 'left',
                    style: 'field'
                  },
                  {
                    text: ''
                  },
                  {
                    text: ''
                  },
                  {
                    text: ''
                  }
                ],
                [
                  {
                    text: ''
                  },
                  {
                    text: 'Date of Test:',
                    alignment: 'right'
                  },
                  {
                    text: [item.sat_date],
                    alignment: 'left',
                    colSpan: 2,
                    style: 'field'
                  },
                  {
                    text: ''
                  },
                  {
                    text: ''
                  },
                  {
                    text: ''
                  }
                ]

              ]
            },
            layout: 'noBorders'
          },
          {
            text: 'Indicate the level of recognition you have achieved in the following scholarship competition(s).',
            style: 'sub'
          },
          {
            table: {
              widths: ['*', '*', '*', '*'],
              headerRows: 0,
              body: [
                [
                  {
                    text: 'National Merit:'
                  },
                  {
                    text: [item.national_merit],
                    alignment: 'left',
                    style: 'field'
                  }
                ],
                [
                  {
                    text: 'National Achievement:'
                  },
                  {
                    text: [item.national_achievement],
                    alignment: 'left',
                    style: 'field'
                  }
                ],
                [
                  {
                    text: 'National Hispanic:'
                  },
                  {
                    text: [item.national_hispanic],
                    alignment: 'left',
                    style: 'field'
                  }
                ]
              ]
            },
            layout: 'noBorders'
          },
          {
            text: 'III.  ACTIVITIES, AWARDS, AND EMPLOYMENT',
            style: 'chapterheader'
          },
          {
            text: 'Employment',
            style: 'notes'
          },
          {
            margin: [0, 0, 0, 5],
            text: ['List all of your previous and current jobs or internships.  Include your job title, your employer’s name, how many hours per week you worked, and the dates of employment.', {
              text: ' List your most recent activities first.',
              bold: true
            }]
          },
          {
            text: [item.employment],
            alignment: 'left',
            style: 'field'
          },
          {
            text: 'Community Service',
            style: 'notes'
          },
          {
            text: 'Describe your role in the organization, the type of organization you were associated with, how many hours of service you devoted each week, and when you participated in each activity.  List most recent service first.'
          },
          {
            text: [item.community_service],
            alignment: 'left',
            style: 'field'
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
            text: 'Extracurricular Activities',
            style: 'notes'
          },
          {
            margin: [0, 0, 0, 5],
            text: [{
              text: 'In order of importance to you',
              bold: true
            }, ', list your top six extracurricular activities (include band, clubs, affiliations, etc.) and the position(s) you held.']
          },
          {
            text: [item.extracurriculars],
            alignment: 'left',
            style: 'field'
          },
          {
            text: 'Awards and Honors',
            style: 'notes'
          },
          {
            margin: [0, 0, 0, 5],
            text: [{
              text: 'In order of importance to you',
              bold: true
            }, ', list up to six major awards, honors, or distinctions that you received both in and out of school during grades 9-12.']
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
            margin: [0, 0, 0, 5],
            text: 'List, in order of preference, the top six colleges or universities you are considering attending (be sure to rank the University of Houston among your choices):',
            style: 'notes'
          },
          {
            style: 'field',
            text: [item.top_six]
          },
          {
            margin: [0, 10, 0, 10],
            text: 'Why have you chosen your academic major(s)? What are your educational plans beyond earning your Bachelor\'s degree? What are your professional and life goals and objectives?'
          },
          {
            style: 'field',
            text: [item.why_major]
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
            text: 'To be considered for a Terry Foundation Scholarship, applicants must file a completed Free Application for Federal Student Aid (FAFSA) with the U.S. Department of Education and indicate the University of Houston (school code: 003652) as a report recipient.  FAFSA forms can be submitted on-line after January 1st at www.fafsa.ed.gov.  You must file your FAFSA no later than February 26th. You must complete the FAFSA or your application cannot be processed.',
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
                  },
                  {
                    columns: [
                      {
                        text: 'Your parents’ marital status:',
                        width: 'auto',
                        style: 'label'
                      },
                      {
                        text: [item.marital_status_parents],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Your total annual income:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.total_annual_income.toString()],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'You presently live with (name & relationship):',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.present_partner],
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
            text: 'Are you claimed as a dependent by a aparent or legal guardian?'
          },
          {
            text: [item.dependent],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'Do you have a Texas Tomorrow Fund or 529 college savings plan?  If so, what is the plan’s value?'
          },
          {
            text: [item.texas_tomorrow_fund],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'Has your family\'s income for 2015 remained the same as 2014?'
          },
          {
            text: [item.income_same],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'If your family\'s income has changed, please indicate by what amount (approximate)'
          },
          {
            text: [item.increased.toString()],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'Number of family members attending college during the 2016-2017 academic year (include yourself):'
          },
          {
            text: [item.members_attending.toString()],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'Are you receiving financial assistance (such as Social Security disability) from any local or federal government entity?'
          },
          {
            text: [item.financial_assistance],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
          },
          {
            text: 'If you answered "Yes" to the above, please indicate the type of assistance and amount per month.'
          },
          {
            text: [item.assistance_type],
            style: 'field',
            width: 'auto',
            margin: [5, 0, 0, 5]
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
                        text: 'Father’s occupation:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.father_occupation],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Step Parent’s occupation:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.stepparent_occupation],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Father’s employer:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.father_employer],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Step Parent’s employer:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.stepparent_employer],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Father’s total annual income:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.father_total_income.toString()],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Step Parent’s total annual income:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.stepparent_total_income.toString()],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Highest level of education achieved:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.father_level_education],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Highest level of education achieved:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.stepparent_level_education],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Mother’s occupation:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.mother_occupation],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Guardian’s occupation:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.guardian_occupation],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Mother’s employer:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.mother_employer],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Guardian’s employer:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.guardian_employer],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Mother’s total annual income:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.mother_total_income.toString()],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Guardian’s total annual income:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.guardian_total_income.toString()],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: 'Highest level of education achieved:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.mother_level_education],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Highest level of education achieved:',
                        style: 'label',
                        width: 'auto'
                      },
                      {
                        text: [item.guardian_level_education],
                        alignment: 'left',
                        style: 'field'
                      }
                    ]
                  }
                ]
              ]
            },
            layout: 'noBorders',
            pageBreak: 'after'
          },
          {
            text: 'The following questions will help to estimate your financial need.  Please complete all questions or your application cannot be considered.',
            style: 'notes'
          },
          {
            columns: [
              {
                text: 'Funds for college saved by you:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.funds_saved_you.toString()],
                alignment: 'left',
                style: 'field'
              },
              {
                text: 'Funds for college saved by others:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.funds_saved_others.toString()],
                alignment: 'left',
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Your parents’ or guardians’ total cash savings (not limited to college):',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.total_savings.toString()],
                alignment: 'left',
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Value of your parents’ or guardians’ other investments (NOT including home):',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.total_investments.toString()],
                alignment: 'left',
                style: 'field'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Net value of your parents’ or guardians’ businesses, farms and/or ranches:',
                style: 'label',
                width: 'auto'
              },
              {
                text: [item.net_value.toString()],
                alignment: 'left',
                style: 'field'
              }
            ]
          },
          {
            text: 'Parents’/Guardians’ Adjusted Gross Income for 2014 (line 37 on Form 1040; line 21 on form 1040A):',
            bold: true
          },
          {
            columns: [
              {
                text: [item.adjusted_cross_income.toString()],
                style: 'field',
                width: 'auto'
              }
            ]
          },
          {
            text: 'Projected parental support (annual):',
            style: 'label'
          },
          {
            text: [item.projected_support.toString()],
            style: 'field'
          },
          {
            text: 'Please describe any special circumstances that affect your family’s ability to fund your college expenses (response required):',
            bold: true
          },
          {
            text: [item.description_special_circumstances],
            style: 'field',
            width: 'auto'
          },
          {
            text: 'Please provide the specified information for all children under 25 years of age in your family.  Do not include yourself or your parents. '
          },
          {
            text: [item.under_25],
            alignment: 'left',
            style: 'field'
          },
          {
            margin: [0, 0, 0, 5],
            text: 'Do you have a sibling who is a current/past Terry Scholar or who is applying for a Terry Scholarship?  If so, please give name(s) and institution(s):'
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
            text: 'VI.  UNIVERSITY SCHOLARSHIP INFORMATION',
            style: 'chapterheader'
          },
          {
            margin: [0, 0, 0, 5],
            text: 'List scholarships for which you have applied for the 2016-2017 academic year:'
          },
          {
            text: [item.scholarship_have_applied],
            alignment: 'left',
            style: 'field'
          },
          {
            margin: [0, 0, 0, 5],
            text: 'List other scholarships or grants you will receive for the 2016-2017 academic year:'
          },
          {
            text: [item.scholarship_will_receive],
            alignment: 'left',
            style: 'field'
          }
        ],
        pageSize: 'LETTER',
        pageMargins: [40, 60, 40, 60]
      };
    }
  });
