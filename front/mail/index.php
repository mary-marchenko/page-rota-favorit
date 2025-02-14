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
    $to_email = ($isMilitary === 'yes') ? 'ignatovyw@gmail.com' : 'gnatykayura@gmail.com';

    // Формування тіла листа
    $body = "
        <h1>Нова заявка</h1>
        <p><strong>Прізвище:</strong> $surname</p>
        <p><strong>Ім'я:</strong> $firstName</p>
        <p><strong>По-батькові:</strong> $middleName</p>
        <p><strong>Номер телефону:</strong> $phone</p>
        <p><strong>Дата народження:</strong> $birthDate</p>
        <p><strong>Нік в телеграмі:</strong> $telegramNick</p>
        <p><strong>Регіон:</strong> $region</p>
        <p><strong>Військовослужбовець:</strong> " . ($isMilitary === 'yes' ? 'Так' : 'Ні') . "</p>
        <p><strong>Згода на обробку даних:</strong> $consent</p>
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