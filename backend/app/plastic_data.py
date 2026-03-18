# backend/app/plastic_data.py

# Данные о типах пластика на основе маркировки [citation:1][citation:4][citation:7]
PLASTIC_INFO = {
    "PET": {
        "name": "ПЭТ (полиэтилентерефталат)",
        "marking": "1",
        "description": "Бутылки для воды, напитков, растительного масла",
        "decomposition_years": "400-450 лет",
        "recycling_tips": "ПЭТ отлично перерабатывается. Важно: бутылки должны быть прозрачными или голубыми/зелёными/коричневыми. Кислотные цвета не перерабатываются [citation:10]",
        "can_recycle": True,
        "recycled_into": "Новые бутылки, щетина для щёток, упаковочные ленты, плёнки, одежда [citation:10]",
        "icon": "🥤"
    },
    "HDPE": {
        "name": "ПНД (полиэтилен низкого давления)",
        "marking": "2",
        "description": "Флаконы для шампуней, канистры, баночки из-под йогуртов [citation:5]",
        "decomposition_years": "20-500 лет",
        "recycling_tips": "Можно сдавать вместе с твёрдым пластиком. Снимите дозаторы и термоусадочные этикетки [citation:5]",
        "can_recycle": True,
        "recycled_into": "Трубы, флаконы, строительные материалы",
        "icon": "🧴"
    },
    "PVC": {
        "name": "ПВХ (поливинилхлорид)",
        "marking": "3",
        "description": "Трубы, плёнка для натяжных потолков, упаковка",
        "decomposition_years": "до 1000 лет",
        "recycling_tips": "В России практически не перерабатывается. Лучше избегать покупки продуктов в такой упаковке [citation:10]",
        "can_recycle": False,
        "recycled_into": "",
        "icon": "⚠️"
    },
    "LDPE": {
        "name": "ПВД (полиэтилен высокого давления)",
        "marking": "4",
        "description": "Пакеты, плёнка, упаковка",
        "decomposition_years": "100-200 лет [citation:4]",
        "recycling_tips": "Растягивающиеся пакеты и плёнку можно сдавать отдельно [citation:2]",
        "can_recycle": True,
        "recycled_into": "Новые пакеты, плёнка",
        "icon": "🛍️"
    },
    "PP": {
        "name": "ПП (полипропилен)",
        "marking": "5",
        "description": "Контейнеры, стаканчики, баночки из-под сметаны, упаковка от макарон [citation:2]",
        "decomposition_years": "100-500 лет",
        "recycling_tips": "Твёрдый ПП хорошо перерабатывается",
        "can_recycle": True,
        "recycled_into": "Детали автомобилей, хозяйственные товары",
        "icon": "🥡"
    },
    "PS": {
        "name": "ПС (полистирол)",
        "marking": "6",
        "description": "Упаковка от тортов, одноразовая посуда, контейнеры [citation:2]",
        "decomposition_years": "500+ лет",
        "recycling_tips": "Вспененный полистирол (пенопласт) перерабатывается отдельно",
        "can_recycle": True,
        "recycled_into": "Строительные материалы",
        "icon": "🍱"
    },
    "OTHER": {
        "name": "Другие виды пластика",
        "marking": "7",
        "description": "Упаковка для мяса, смешанные материалы",
        "decomposition_years": "неопределённо",
        "recycling_tips": "Проверяйте в местных пунктах приёма. Часто не перерабатывается [citation:2]",
        "can_recycle": False,
        "recycled_into": "",
        "icon": "❓"
    },
    "plastic": {
        "name": "Пластик",
        "marking": "",
        "description": "Общий класс пластика",
        "decomposition_years": "400-1000 лет [citation:7]",
        "recycling_tips": "Сортируйте по типу и сдавайте в переработку!",
        "can_recycle": True,
        "recycled_into": "Зависит от типа",
        "icon": "♻️"
    }
}

def get_plastic_info(class_name):
    """Возвращает информацию о типе пластика по имени класса"""
    # Пробуем найти точное совпадение
    if class_name in PLASTIC_INFO:
        return PLASTIC_INFO[class_name]
    
    # Пробуем найти по вхождению ключевого слова
    class_lower = class_name.lower()
    for key, info in PLASTIC_INFO.items():
        if key in class_lower:
            return info
    
    # Возвращаем общую информацию, если ничего не нашли
    return PLASTIC_INFO["plastic"]