var app = angular.module('myApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

app.run(function($transform) {
    window.$transform = $transform;
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', { templateUrl: 'home.html', reloadOnSearch: false, controller: 'LoginController' })
        .when('/signup', { templateUrl: 'signup.html', reloadOnSearch: false, controller: 'LoginController' })
        .when('/mypage', { templateUrl: 'mypage.html', reloadOnSearch: false, controller: 'LoginController' })
        .when('/schedule', { templateUrl: 'schedule.html', reloadOnSearch: false, controller: 'ScheController' })
        .when('/alarm', { templateUrl: 'alarm.html', reloadOnSearch: false })


});

app.controller('MainController', function($rootScope, $scope) {

    $rootScope.SERVER_URL = 'http://localhost:8080/weSchedule';
    //$rootScope.SERVER_URL = 'http://52.192.205.35:8080/weSchedule';



    $scope.swiped = function(direction) {
        alert('Swiped ' + direction);
    };

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loading = false;
    });

});


app.controller('LoginController', function($rootScope, $scope, $http) {

    if ($rootScope.user) {
        $rootScope.user.passwd = null;
    }
    $scope.login = function() {
        $http({
            method: 'post',
            //url: 'http://52.192.205.35:8080/weSchedule/login.do',
            url: $rootScope.SERVER_URL + '/login.do',
            params: { loginId: $scope.loginId, passwd: $scope.passwd }
        }).success(function(data, status, headers, config) {
            if (data) {
                $rootScope.user = data;
                alert("로그인 성공");
                location.href = '#/schedule';

            } else {
                alert("로그인 실패");
                $rootScope.user = null;
                $scope.loginMessage = "로그인이 실패하였습니다.";
            }
        }).error(httpError);
    }

    $scope.signup = function() {
        $http({
            method: 'post',
            url: $rootScope.SERVER_URL + '/signup.do',
            //url: 'http://52.192.205.35:8080/weSchedule/signup.do',
            params: { loginId: $scope.loginId, passwd: $scope.passwd, name: $scope.name, email: $scope.email }
        }).success(function(data, status, headers, config) {
            alert("회원가입 성공");
            location.href = '#/';
        }).error(httpError);

    }

    $scope.updateUser = function() {

        $http({
            method: 'post',
            url: $rootScope.SERVER_URL + '/updateuser.do',
            //url: 'http://52.192.205.35:8080/weSchedule/updateuser.do',
            params: { loginId: $scope.user.loginId, passwd: $scope.user.passwd, name: $scope.user.name, email: $scope.user.email }
        }).success(function(data, status, headers, config) {
            alert("정보 수정 성공");
        }).error(httpError);

    }

    $scope.logout = function() {
        $rootScope.user = null;
        location.href = '#/';
    }
});










app.controller('ScheController', function($rootScope, $scope, $http) {

    $scope.ScheduleUpdate = function() {
         $.ajax({
                    url: $rootScope.SERVER_URL + '/updateschedule.do',
                    data: { start: $('#info_start').val() + ' ' + $('#info_startTime').val(),
                 		    end: $('#info_end').val() + ' ' + $('#info_endTime').val(),
                   		    title: $('#info_title').val(),
                   		    id: $('#info_id').val() 
                   		},
                    type: "POST",
                    datatype: "json",
                    success: function(data) {
                    	$('#calendar').fullCalendar('refetchEvents');
                    }
           });
    }

    $scope.ScheduleDelete = function() {
        if (confirm("정말 삭제하시겠습니까?")) {
        	$.ajax({
                    url: $rootScope.SERVER_URL + '/deleteschedule.do',
                    data: { start: $('#info_start').val() + ' ' + $('#info_startTime').val(),
                 		    end: $('#info_end').val() + ' ' + $('#info_endTime').val(),
                   		    title: $('#info_title').val(),
                   		    id: $('#info_id').val()
                   		},
                    type: "POST",
                    datatype: "json",
                    success: function(data) {
                    	$('#calendar').fullCalendar('refetchEvents');
                    }
           });
            $rootScope.Ui.turnOff("modal_info");
        } else
            return false;
    }

    $scope.ScheduleInsert = function() {
        $.ajax({
            //url: 'http://52.192.205.35:8080/weSchedule/insertschedule.do',
            url: $rootScope.SERVER_URL + '/insertschedule.do',
            data: { start: $('#start').val() + ' ' + $('#startTime').val(), end: $('#end').val() + ' ' + $('#endTime').val(), title: $('#title').val(), user_id: $rootScope.user.loginId },
            type: "POST",
            datatype: "json",
            success: function() {
                $('#calendar').fullCalendar('refetchEvents');
            }
        })
    }

    $(document).ready(function() {

        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: new Date(),
            allDayText: '시간', // 주간,월간
            axisFormat: 'tt hh', // 주간,월간
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
            buttonText: {
                today: '오늘',
                month: '월간',
                week: '주간',
                day: '일간'
            },
            selectable: true, //사용자가 클릭 및 드래그를 하여 일정을 변경 할수 있도록
            selectHelper: true,
            select: function(start, end) {
                $('#modal_insert').click();
                $('#start').val(moment(start).format('YYYY/MM/DD'));
                $('#end').val(moment(end).format('YYYY/MM/DD'));





                $('#calendar').fullCalendar('unselect');



            },

            eventClick: function(calEvent, jsEvent, view) {
            	
                $('#modal_info').click();
                $('#info_title').val(calEvent.title);
                $('#info_start').val(moment(calEvent.start).format('YYYY/MM/DD'));
                $('#info_end').val(moment(calEvent.end).format('YYYY/MM/DD'));
                $('#info_startTime').val(moment(calEvent.start).format('hh:mm'));
                $('#info_endTime').val(moment(calEvent.end).format('hh:mm'));
                $('#info_id').val(calEvent.id);


                // change the border color just for fun
                //$(this).css('border-color', 'red');

            },

            editable: true,
            eventLimit: true, // allow "more" link when too many events

            eventDrop: function(event, delta, revertFunc) {
            	if (!confirm("일정을 변경하시겠습니까?")) {
                    revertFunc();
                }

                $.ajax({
                    url: $rootScope.SERVER_URL + '/moveschedule.do',
                    data: { id: event.id,
                    		 start: moment(event.start).format('YYYY/MM/DD hh:mm'),
                    		  end: moment(event.end).format('YYYY/MM/DD hh:mm') },
                    type: "POST",
                    datatype: "json",
                    /*success: function(data) {
                    	

                    }*/
                });
                


                

            },

            events: function(start, end, timezone, callback) {
                if ($rootScope.user) {

                    $.ajax({

                        url: $rootScope.SERVER_URL + '/' + $rootScope.user.loginId + '/loadschedule.do',
                        success: function(data) {

                            callback(data);
                        }
                    });
                }

            }

            /*{
                 url : 'http://52.192.205.35:8080/weSchedule/'+loginValue +'/loadschedule.do?start=2999-05-16'
            }*/

        });

    });

});
