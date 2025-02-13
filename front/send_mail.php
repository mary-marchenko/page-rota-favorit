<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $surname = $_POST['surname'] ?? '';
    $firstName = $_POST['first-name'] ?? '';
    $middleName = $_POST['middle-name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $date = $_POST['date'] ?? '';
    $telegram = $_POST['telegram'] ?? '';
    $region = $_POST['region'] ?? '';
    $military = $_POST['yes-no'] ?? '';
    $agreement = isset($_POST['checkbox']) ? "Так" : "Ні";

    $to = "gnatykayura@gmail.com"; // Замінити на реальний email
    $subject = "Нова заявка з форми Рота Фаворит";
    $message = "
        Прізвище: $surname\n
        Ім'я: $firstName\n
        По-батькові: $middleName\n
        Телефон: $phone\n
        Дата народження: $date\n
        Telegram: $telegram\n
        Регіон: $region\n
        Військовослужбовець: $military\n
        Згода на обробку даних: $agreement
    ";

    $headers = "From: no-reply@example.com\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "Заявка успішно відправлена!";
    } else {
        echo "Помилка при відправці.";
    }
} else {
    echo "Метод запиту не дозволений.";
}
?>
