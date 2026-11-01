import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { HeroDepthExperience } from './components/HeroDepthExperience';
import { DepthToLightTransition } from './components/DepthToLightTransition';
import { FormatsSection } from './components/FormatsSection';
import { HistorySection } from './components/HistorySection';
import { WhereToBuySection } from './components/WhereToBuySection';
import { FinaleFooterSection } from './components/FinaleFooterSection';
import { Modals } from './components/Modals';
import type { ModalKind, OrderSelection } from './types';

export function App() {
  const [darkFromSource, setDarkFromSource] = useState(false);
  const [darkFromTransition, setDarkFromTransition] = useState(false);
  const [darkFromFinale, setDarkFromFinale] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [orderSelection, setOrderSelection] = useState<OrderSelection>({
    volume: '1.5',
    waterType: 'sparkling',
  });

  const handleSourceDark = useCallback((isDark: boolean) => {
    setDarkFromSource(isDark);
  }, []);

  const handleTransitionDark = useCallback((isDark: boolean) => {
    setDarkFromTransition(isDark);
  }, []);

  const handleFinaleDark = useCallback((isDark: boolean) => {
    setDarkFromFinale(isDark);
  }, []);

  const openOrderModal = useCallback((preset?: OrderSelection) => {
    if (preset) setOrderSelection(preset);
    setActiveModal('order');
  }, []);

  return (
    <div className="site-shell">
      <a href="#formats" className="skip-to-content">
        Перейти к содержанию
      </a>

      <Header
        isDarkScene={darkFromSource || darkFromTransition || darkFromFinale}
        onOrderClick={() => openOrderModal()}
      />

      <main>
        {/* Blocks 1 & 2: Continuous Bottle Hero -> 80m Artesian Source */}
        <HeroDepthExperience
          onOrderClick={() => openOrderModal()}
          onDarkSceneChange={handleSourceDark}
        />

        {/* Cinematic Scroll Transition: «Из глубины к свету» (80m Depth -> Surface Light -> 3 Bottles) */}
        <DepthToLightTransition onDarkSceneChange={handleTransitionDark} />

        {/* Block 3: «Выберите свой формат» (0,5 / 1 / 1,5 L) */}
        <FormatsSection onOrderFormat={(sel) => openOrderModal(sel)} />

        {/* Block 4: «Как всё начиналось» (Western Crimea Coast -> Frunze Plant) */}
        <HistorySection />

        {/* Block 5: «Где купить» (Direct Delivery & Planned Retail Still-Life) */}
        <WhereToBuySection
          onDeliveryClick={() => openOrderModal()}
          onRetailClick={() => setActiveModal('retail')}
        />
      </main>

      {/* Block 6: «Остаёмся на связи» Finale + Dark-Blue Footer */}
      <FinaleFooterSection
        onOrderClick={() => openOrderModal()}
        onPrivacyClick={() => setActiveModal('privacy')}
        onAssetsNoteClick={() => setActiveModal('assets')}
        onDarkSceneChange={handleFinaleDark}
      />

      <Modals
        activeModal={activeModal}
        selection={orderSelection}
        onSelectionChange={setOrderSelection}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
