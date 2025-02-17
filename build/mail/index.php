<?php
require_once __DIR__ . '/vendor/autoload.php';
$settings = require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/functions.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Отримання даних з форми
    $surname = htmlspecialchars($_POST['surname']);
    $firstName = htmlspecialchars($_POST['firstName']);
    $middleName = htmlspecialchars($_POST['middleName']);
    $phone = htmlspecialchars($_POST['phone']);
    $birthDate = htmlspecialchars($_POST['birthDate']);
    $telegramNick = htmlspecialchars($_POST['telegramNick']);
    $region = htmlspecialchars($_POST['region']);
    $isMilitary = htmlspecialchars($_POST['isMilitary']);
    $consent = isset($_POST['consent']) ? 'Так' : 'Ні';

    // Визначення пошти отримувача
    $to_email = ($isMilitary === 'yes') ? 'favoritrubak@gmail.com' : 'cv_recruiter@ukr.net';

    // Формування тіла листа
   $body = "
       <html>
       <head>
           <style>
               body {
                   font-family: Arial, sans-serif;
                   background-color: #f4f4f4;
                   margin: 0;
                   padding: 0;
               }
               .container {
                   max-width: 600px;
                   margin: 20px auto;
                   padding: 20px;
                   background: #fff;
                   border-radius: 10px;
                   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
               }
               h2 {
                   color: #007BFF;
                   text-align: center;
                   border-bottom: 2px solid #007BFF;
                   padding-bottom: 10px;
               }
               table {
                   width: 100%;
                   border-collapse: collapse;
                   margin-top: 20px;
               }
               td {
                   padding: 10px;
                   border-bottom: 1px solid #ddd;
               }
               .label {
                   font-weight: bold;
                   color: #333;
               }
               .value {
                   color: #555;
               }
           </style>
       </head>
       <body>
           <div class='container'>
               <h2>Нова заявка Rota Favorit</h2>
               <table>
                   <tr>
                       <td class='label'>Прізвище:</td>
                       <td class='value'>$surname</td>
                   </tr>
                   <tr>
                       <td class='label'>Ім'я:</td>
                       <td class='value'>$firstName</td>
                   </tr>
                   <tr>
                       <td class='label'>По-батькові:</td>
                       <td class='value'>$middleName</td>
                   </tr>
                   <tr>
                       <td class='label'>Номер телефону:</td>
                       <td class='value'>$phone</td>
                   </tr>
                   <tr>
                       <td class='label'>Дата народження:</td>
                       <td class='value'>$birthDate</td>
                   </tr>
                   <tr>
                       <td class='label'>Нік в телеграмі:</td>
                       <td class='value'>$telegramNick</td>
                   </tr>
                   <tr>
                       <td class='label'>Регіон:</td>
                       <td class='value'>$region</td>
                   </tr>
                   <tr>
                       <td class='label'>Військовослужбовець:</td>
                       <td class='value'>" . ($isMilitary === 'yes' ? 'Так' : 'Ні') . "</td>
                   </tr>
                   <tr>
                       <td class='label'>Згода на обробку даних:</td>
                       <td class='value'>$consent</td>
                   </tr>
               </table>
           </div>
       </body>
       </html>
   ";


    // Відправка листа
    $result = send_mail($settings['mail_settings_prod'], [$to_email], 'Нова заявка', $body);

    // Виведення повідомлення про результат
    if ($result) {
        echo "Дякуємо за вашу заявку!";
    } else {
        echo "Помилка при відправці листа. Будь ласка, спробуйте ще раз.";
    }
} else {
    echo "Форма не була відправлена.";
}
?>