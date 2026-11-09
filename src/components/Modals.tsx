import { useEffect, useState } from 'react';
import type { ModalKind, OrderSelection, VolumeFormat, WaterType } from '../types';

interface ModalsProps {
  activeModal: ModalKind;
  selection: OrderSelection;
  onSelectionChange: (next: OrderSelection) => void;
  onClose: () => void;
}

export function Modals({
  activeModal,
  selection,
  onSelectionChange,
  onClose,
}: ModalsProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    if (!activeModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const isOrderOrRetail = activeModal === 'order' || activeModal === 'retail';

  const volumeLabel =
    selection.volume === '0.5' ? '0,5 л' : '1,5 л';
  const typeLabel = selection.waterType === 'sparkling' ? 'газированная' : 'негазированная';

  const buildMailtoHref = () => {
    const subject =
      activeModal === 'retail'
        ? 'Запрос наличия в магазинах — Природный Элемент'
        : `Заказ воды Природный Элемент (${volumeLabel}, ${typeLabel})`;

    const lines = [
      activeModal === 'retail'
        ? 'Здравствуйте! Хочу уточнить наличие воды «Природный Элемент» в розничных магазинах / условия поставок.'
        : `Здравствуйте! Хочу оформить заказ воды «Природный Элемент».`,
      `Формат: ${volumeLabel} (${typeLabel})`,
      name ? `Имя: ${name}` : '',
      phone ? `Телефон: ${phone}` : '',
      comment ? `Комментарий / адрес доставки: ${comment}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:matushka-voditsa@mail.ru?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.location.href = buildMailtoHref();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-sheet">
        <button
          type="button"
          className="modal-sheet__close"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4.5 4.5L15.5 15.5M15.5 4.5L4.5 15.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isOrderOrRetail && (
          <div className="modal-content">
            <h2 id="modal-heading" className="modal-content__title">
              {activeModal === 'retail' ? 'Уточнить наличие' : 'Заказать воду'}
            </h2>
            <p className="modal-content__lead">
              {activeModal === 'retail'
                ? 'Выход продукции в торговые сети Крыма планируется. Свяжитесь с нами напрямую, чтобы узнать ближайшие точки появления воды или обсудить поставку.'
                : 'Свяжитесь с отделом продаж ООО «Матушка-водица» по телефону или отправьте заявку — мы согласуем объём и удобное время доставки.'}
            </p>

            <div className="modal-direct-channels">
              <a href="tel:+79790314673" className="modal-channel-link">
                <span className="modal-channel-link__label">Прямой телефон</span>
                <span className="modal-channel-link__val">+7 979 031-46-73</span>
              </a>
              <a href={buildMailtoHref()} className="modal-channel-link">
                <span className="modal-channel-link__label">Электронная почта</span>
                <span className="modal-channel-link__val">matushka-voditsa@mail.ru</span>
              </a>
            </div>

            {submitted ? (
              <div className="modal-success">
                <p className="modal-success__title">Черновик письма сформирован</p>
                <p className="modal-success__text">
                  Отправьте открывшееся письмо на <strong>matushka-voditsa@mail.ru</strong> или
                  позвоните нам по номеру{' '}
                  <a href="tel:+79790314673">+7 979 031-46-73</a> для мгновенного подтверждения.
                </p>
                <button type="button" className="btn-pill btn-pill--primary" onClick={onClose}>
                  Готово
                </button>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>
                {activeModal === 'order' && (
                  <div className="modal-form__row-selectors">
                    <div className="modal-selector-group">
                      <span className="modal-form__label">Объём</span>
                      <div className="modal-pills">
                        {(['0.5', '1.5'] as VolumeFormat[]).map((v) => (
                          <button
                            key={v}
                            type="button"
                            className={`modal-pill ${selection.volume === v ? 'is-active' : ''}`}
                            onClick={() => onSelectionChange({ ...selection, volume: v })}
                          >
                            {v === '0.5' ? '0,5 л' : '1,5 л'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="modal-selector-group">
                      <span className="modal-form__label">Исполнение</span>
                      <div className="modal-pills">
                        {(['sparkling', 'still'] as WaterType[]).map((wt) => (
                          <button
                            key={wt}
                            type="button"
                            className={`modal-pill ${selection.waterType === wt ? 'is-active' : ''}`}
                            onClick={() => onSelectionChange({ ...selection, waterType: wt })}
                          >
                            {wt === 'sparkling' ? 'Газированная' : 'Негазированная'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-form__grid">
                  <label className="modal-field">
                    <span className="modal-form__label">Ваше имя</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Александр"
                      required
                    />
                  </label>
                  <label className="modal-field">
                    <span className="modal-form__label">Телефон для связи</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (978) 000-00-00"
                      required
                    />
                  </label>
                </div>

                <label className="modal-field">
                  <span className="modal-form__label">
                    {activeModal === 'retail'
                      ? 'Город или населённый пункт Крыма'
                      : 'Населённый пункт и желаемое количество упаковок'}
                  </span>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      activeModal === 'retail'
                        ? 'Например: Евпатория / Саки / Симферополь'
                        : 'Например: г. Саки, 4 упаковки по 1,5 л'
                    }
                  />
                </label>

                <div className="modal-form__submit-row">
                  <button type="submit" className="btn-pill btn-pill--primary">
                    {activeModal === 'retail' ? 'Отправить запрос' : 'Оформить заявку'}
                  </button>
                  <span className="modal-form__consent">
                    Отправляя заявку, вы соглашаетесь с политикой обработки персональных данных ООО
                    «Матушка-водица».
                  </span>
                </div>
              </form>
            )}
          </div>
        )}

        {activeModal === 'privacy' && (
          <div className="modal-content modal-content--prose">
            <h2 id="modal-heading" className="modal-content__title">
              Политика конфиденциальности
            </h2>
            <p>
              Настоящая Политика обработки персональных данных разработана в соответствии с
              Федеральным законом РФ № 152-ФЗ «О персональных данных» и действует в отношении всей
              информации, которую <strong>ООО «Матушка-водица»</strong> (адрес производства:
              Республика Крым, Сакский район, с. Фрунзе, ул. Шоссе Приморское, 1А) может получить о
              посетителе при обращении через сайт бренда «Природный Элемент».
            </p>
            <p>
              <strong>1. Состав данных.</strong> Мы запрашиваем исключительно контактные сведения,
              необходимые для обратной связи и согласования доставки питьевой воды: имя, контактный
              телефон, адрес электронной почты и комментарий к заказу.
            </p>
            <p>
              <strong>2. Цели обработки.</strong> Исполнение заявок на доставку воды, ответы на
              запросы о наличии продукции в розничной продаже, информирование об условиях поставок.
            </p>
            <p>
              <strong>3. Защита и хранение.</strong> ООО «Матушка-водица» не передаёт персональные
              данные третьим лицам, за исключением случаев, прямо предусмотренных законодательством
              РФ. По вопросам отзыва согласия или удаления данных направьте обращение на{' '}
              <a href="mailto:matushka-voditsa@mail.ru">matushka-voditsa@mail.ru</a>.
            </p>
          </div>
        )}

        {activeModal === 'assets' && (
          <div className="modal-content modal-content--prose">
            <h2 id="modal-heading" className="modal-content__title">
              Спецификация исходных материалов к публикации
            </h2>
            <p>
              В текущей версии сайта используются подлинные фотографии бутылок 0,5 л и 1,5 л,
              фирменный логотип, этикетка и фотографии завода в с. Фрунзе из официального буклета
              «Природный Элемент». Для финального наполнения предусмотрены готовые места под
              следующие материалы:
            </p>
            <ul>
              <li>
                <strong>Протокол лабораторного анализа воды:</strong> точные числовые диапазоны
                общей минерализации (мг/л), Ca²⁺, Mg²⁺, Na⁺, HCO₃⁻ и pH для блока «Источник
                глубиной 80 метров».
              </li>
              <li>
                <strong>Предметная фотография бутылки 1,0 л:</strong> студийный кадр газированной и
                негазированной версий на нейтральном светлом фоне с единым боковым контровым светом
                (в блоке «Выберите свой формат» сейчас установлен честный архитектурный контур без
                искажения реальных пропорций тары).
              </li>
              <li>
                <strong>Опционально для 360°-скролл-вращения:</strong> секвенция из 36–48 студийных
                кадров вращения бутылки в формате PNG/WebP с альфа-каналом либо CAD/GLB-модель ПЭТ-пресс-формы
                с UV-развёрткой оригинальной этикетки.
              </li>
              <li>
                <strong>География доставки и розницы:</strong> согласованные зоны доставки по Крыму,
                минимальный объём заказа и список подтверждённых торговых точек после старта продаж.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
