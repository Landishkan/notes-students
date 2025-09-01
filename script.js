class StudentNotes {
   constructor() {
        this.currentSubject = null;
        this.currentView = 'subjects';
        this.currentFilter = 'all';
        this.currentMaterialType = null; // 'lecture' или 'homework'
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderSubjects();
        this.setupNotificationPermission();
        
        setTimeout(() => checkForUpdates(), 3000);
    }

    setupNotificationPermission() {
        // Показываем запрос разрешения если еще не спрашивали
        if ('Notification' in window && Notification.permission === 'default') {
            this.showNotificationPermission();
        }
    }

    showNotificationPermission() {
        const permissionDiv = document.createElement('div');
        permissionDiv.className = 'notification-permission';
        permissionDiv.innerHTML = `
            <span>Разрешить уведомления о новых материалах?</span>
            <button onclick="studentNotes.grantNotification()">Да</button>
            <button onclick="studentNotes.hideNotification()">Нет</button>
        `;
        document.body.appendChild(permissionDiv);
        permissionDiv.style.display = 'block';
    }

    async grantNotification() {
        try {
            const permission = await Notification.requestPermission();
            this.hideNotification();
            
            if (permission === 'granted') {
                document.getElementById('notification-btn').textContent = '🔔 Уведомления включены';
                document.getElementById('notification-btn').style.background = '#4CAF50';
                
                // Тестовое уведомление
                new Notification('Уведомления включены!', {
                    body: 'Вы будете получать уведомления о новых материалах',
                    icon: 'https://cdn-icons-png.flaticon.com/512/103/103093.png'
                });
            }
        } catch (error) {
            console.error('Ошибка запроса разрешения:', error);
        }
    }

    hideNotification() {
        const permissionDiv = document.querySelector('.notification-permission');
        if (permissionDiv) {
            permissionDiv.style.display = 'none';
        }
    }

    // Рендер интерфейса
    renderSubjects() {
        const subjectsList = document.getElementById('subjects');
        subjectsList.innerHTML = '';

        appData.subjects.forEach((subject, index) => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.onclick = () => {
                this.currentView = 'subjects';
                this.selectSubject(index);
            };
            subjectsList.appendChild(li);
        });
    }

    showFilesView() {
        this.currentView = 'files';
        document.getElementById('current-section').textContent = 'Файлы для скачивания';
        document.getElementById('material-types').style.display = 'none';
        
        this.renderFiles();
    }

    renderFiles() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = '';

        if (appData.materials.length === 0) {
            contentArea.innerHTML = '<p>Нет файлов для скачивания</p>';
            return;
        }

        appData.materials.forEach(file => {
            const fileExt = file.file.split('.').pop().toLowerCase();
            let iconClass = '';
            
            switch (fileExt) {
                case 'pdf': iconClass = 'file-type-pdf'; break;
                case 'doc': case 'docx': iconClass = 'file-type-doc'; break;
                case 'xls': case 'xlsx': iconClass = 'file-type-xls'; break;
                default: iconClass = 'file-type-default';
            }

            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="file-icon ${iconClass}">
                        ${fileExt === 'pdf' ? '📄' : '📝'}
                    </div>
                    <div class="file-info">
                        <div class="file-title">${file.title}</div>
                        <div class="file-description">${file.description}</div>
                        <div class="file-meta">
                            ${new Date(file.date).toLocaleDateString('ru-RU')} • ${file.size}
                        </div>
                    </div>
                </div>
                <a href="${file.file}" class="download-btn" download>
                    📥 Скачать
                </a>
            `;
            contentArea.appendChild(fileCard);
        });
    }

    renderMaterials() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = '';

        if (this.currentSubject === null) {
            contentArea.innerHTML = '<p>Выберите предмет для просмотра материалов</p>';
            return;
        }

        const subject = appData.subjects[this.currentSubject];
        let materials = subject.materials;

        if (this.currentFilter !== 'all') {
            materials = materials.filter(m => m.type === this.currentFilter);
        }

        if (materials.length === 0) {
            contentArea.innerHTML = '<p>Нет материалов для отображения</p>';
            return;
        }

        materials.forEach((material, index) => {
            const card = document.createElement('div');
            card.className = 'material-card';
            card.innerHTML = `
                <div class="material-type">${material.type === 'lecture' ? '📖 Лекция' : '📝 ДЗ'}</div>
                <h4>${material.title}</h4>
                <div class="material-date">${new Date(material.date).toLocaleDateString('ru-RU')}</div>
                <div class="material-preview">${material.content.substring(0, 100)}...</div>
            `;
            card.onclick = () => this.showMaterial(index);
            contentArea.appendChild(card);
        });
    }

    showMaterial(index) {
        const subject = appData.subjects[this.currentSubject];
        const material = subject.materials[index];
        this.currentMaterialType = material.type;
        
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="material-content">
                <div class="material-header">
                    <h3>${material.title}</h3>
                    <span class="material-type-badge">
                        ${material.type === 'lecture' ? '📖 Лекция' : '📝 Домашняя работа'}
                    </span>
                </div>
                <div class="material-date">Дата: ${new Date(material.date).toLocaleDateString('ru-RU')}</div>
                <div class="material-text">${material.content.replace(/\n/g, '<br>')}</div>
                
                <div class="material-navigation">
                    ${this.getNavigationButtons(subject, index)}
                </div>
                
                <button onclick="studentNotes.backToMaterials()" class="back-btn">
                    ← Назад к материалам
                </button>
            </div>
        `;
    }

getNavigationButtons(subject, currentIndex) {
        const materials = subject.materials;
        let buttons = '';
        
        // Находим связанные материалы (лекция ↔ ДЗ)
        const currentMaterial = materials[currentIndex];
        const relatedMaterials = materials.filter((material, index) => 
            material.id !== currentMaterial.id && 
            material.id.includes(currentMaterial.id.split('-').slice(0, -1).join('-'))
        );

        if (relatedMaterials.length > 0) {
            buttons = '<div class="related-materials">';
            
            relatedMaterials.forEach(relatedMaterial => {
                const relatedIndex = materials.findIndex(m => m.id === relatedMaterial.id);
                const buttonText = relatedMaterial.type === 'lecture' ? 
                    '📖 Перейти к лекции' : '📝 Перейти к ДЗ';
                
                buttons += `
                    <button onclick="studentNotes.showMaterial(${relatedIndex})" class="nav-btn">
                        ${buttonText}
                    </button>
                `;
            });
            
            buttons += '</div>';
        }

        return buttons;
    }

    backToMaterials() {
        this.renderMaterials();
    }

    selectSubject(index) {
        this.currentSubject = index;
        this.currentView = 'subjects';
        
        const subject = appData.subjects[index];
        document.getElementById('current-section').textContent = subject.name;
        document.getElementById('material-types').style.display = 'flex';
        
        this.renderMaterials();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === filter);
        });
        this.renderMaterials();
    }

    // Обработчики событий
    setupEventListeners() {
        // Файлы
        document.getElementById('show-files').addEventListener('click', () => {
            this.showFilesView();
        });

        // Фильтры
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.type);
            });
        });

        // Уведомления
        document.getElementById('notification-btn').addEventListener('click', () => {
            this.grantNotification();
        });
    }
}

// Глобальная переменная для доступа из HTML
let studentNotes;

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    studentNotes = new StudentNotes();
});
