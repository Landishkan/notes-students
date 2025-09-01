// Этот файл вы редактируете чтобы добавлять новые материалы
const appData = {
    lastUpdate: '2024-01-15T10:00:00', // Меняйте эту дату при добавлении новых материалов
    subjects: [
        {
            id: 'math',
            name: 'Правовое обеспечение',
            materials: [
                {
                    id: 'math-lecture-1',
                    type: 'lecture',
                    title: 'Лекция 1: ',
                    date: '2024-01-10',
                    content: `Основные понятия математического анализа.

Пределы функций.
Производные и их применение.

Важные формулы:
• lim(x→0) sin(x)/x = 1
• (x^n)' = n*x^(n-1)`
                },
                {
                    id: 'math-homework-1',
                    type: 'homework',
                    title: 'ДЗ 1: ',
                    date: '2024-01-12',
                    content: `Задачи для самостоятельного решения:

1. Найти предел: lim(x→0) (1 - cos(x))/x²
2. Вычислить производную: f(x) = x³ + 2x² - 5x + 1
3. Исследовать функцию на монотонность: f(x) = x² - 4x + 3

Срок сдачи: 20.01.2024`
                }
            ]
        },
        {
            id: 'physics',
            name: 'Менеджмент',
            materials: [
                {
                    id: 'physics-lecture-1',
                    type: 'lecture',
                    title: 'Лекция 1: ',
                    date: '2024-01-08',
                    content: `.

Законы Ньютона:
1. Закон инерции
2. F = ma
3. Закон действия и противодействия

Кинематика и динамика.`
                }
            ]
        },
        {
            id: 'programming',
            name: 'Внедрение и поддержка компьютерных систем',
            materials: [
                {
                    id: 'prog-lecture-1',
                    type: 'lecture',
                    title: 'Лекция 1: ',
                    date: '2024-01-05',
                    content: `.

Темы:
• Переменные (let, const)
• Типы данных
• Функции
• Объекты

Пример кода:
function greet(name) {
    return 'Hello, ' + name + '!';
}`
                },
                {
                    id: 'prog-homework-1',
                    type: 'homework',
                    title: 'ДЗ 1: ',
                    date: '2024-01-07',
                    content: `Практические задания:

1. Написать функцию сложения двух чисел
2. Создать объект "студент" с полями: имя, возраст, группа
3. Реализовать простой калькулятор

Срок: 15.01.2024`
                }
            ]
           
        } 
       
    ],
     materials: [
        {
            id: 'math-formulas',
            type: 'file',
            title: 'Пока пусто',
            description: '',
            file: 'files/math_formulas.pdf',
            date: '2024-01-10',
            size: '2.3 MB'
        },
        {
            id: 'physics-lab',
            type: 'file',
            title: 'Пока пусто',
            description: '',
            file: 'files/physics_lab.docx',
            date: '2024-01-12',
            size: '1.8 MB'
        },
        {
            id: 'programming-guide',
            type: 'file',
            title: 'Пока пусто',
            description: '',
            file: 'files/js_guide.pdf',
            date: '2024-01-14',
            size: '5.1 MB'
        }
    ]
};

// Проверка обновлений
function checkForUpdates() {
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const lastKnownUpdate = localStorage.getItem('lastKnownUpdate');
    const lastKnownFileUpdate = localStorage.getItem('lastKnownFileUpdate');
    
    // Проверяем обновления лекций/ДЗ
    if (lastKnownUpdate !== appData.lastUpdate) {
        showUpdateNotification('Новые лекции и задания!');
        localStorage.setItem('lastKnownUpdate', appData.lastUpdate);
    }
    
    // Проверяем обновления файлов
    if (lastKnownFileUpdate !== appData.lastFileUpdate) {
        showUpdateNotification('Новые файлы для скачивания!');
        localStorage.setItem('lastKnownFileUpdate', appData.lastFileUpdate);
    }
    
    localStorage.setItem('lastUpdateCheck', new Date().toISOString());
}

function showUpdateNotification(message) {
    const notification = document.getElementById('update-notification');
    notification.querySelector('span').textContent = message;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 10000);
    
    // Браузерное уведомление
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Обновление на сайте', {
            body: message,
            icon: 'https://cdn-icons-png.flaticon.com/512/103/103093.png',
            tag: 'update'
        });
    }
}