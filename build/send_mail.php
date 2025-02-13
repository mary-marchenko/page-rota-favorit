use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Підключаємо файли PHPMailer (шлях вказуй залежно від того, де лежить папка PHPMailer)
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$mail = new PHPMailer(true);

try {
    // Налаштування SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'ihnatovyurii@gmail.com';  // Твій Gmail
    $mail->Password = 'your_app_password';       // Пароль додатка (не твій реальний пароль!)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Відправник
    $mail->setFrom('ihnatovyurii@gmail.com', 'Твоє Ім\'я');

    // Отримувач
    $mail->addAddress('gnatykayura@gmail.com', 'Отримувач');

    // Тема листа
    $mail->Subject = 'Тестовий лист із PHP';

    // Контент (HTML або звичайний текст)
    $mail->isHTML(true);
    $mail->Body = '<h1>Привіт!</h1><p>Це тестовий лист відправлений через SMTP Gmail.</p>';
    $mail->AltBody = 'Це тестовий лист відправлений через SMTP Gmail.';

    // Відправка
    $mail->send();
    echo 'Лист успішно надіслано!';
} catch (Exception $e) {
    echo "Помилка: {$mail->ErrorInfo}";
}
