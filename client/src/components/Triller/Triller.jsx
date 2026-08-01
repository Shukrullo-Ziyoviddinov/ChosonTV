import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import LoaderSkeleton from '../LoaderSkeleton/LoaderSkeleton';
import { fetchTrillers } from '../../api/trillersApi';
import TrillerCart from './TrillerCart';
import TrillerModal from './TrillerModal';
import './Triller.css';

const PLACEHOLDER_COUNT = 6;

const Triller = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchTrillers({ page: 1, limit: 20, active: true });
        if (!cancelled) setItems(rows);
      } catch (_error) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showSection = loading || items.length > 0;
  if (!showSection) return null;

  return (
    <section className="triller">
      <div className="triller-container">
        <div className="triller-header">
          {loading && items.length === 0 ? (
            <LoaderSkeleton variant="text" className="triller-title-skeleton" width={140} height={28} />
          ) : (
            <h2 className="triller-title">
              {i18n.language === 'ru' ? 'Трейлеры' : 'Trillerlar'}
            </h2>
          )}
        </div>

        <HorizontalScroll scrollAmount={300}>
          {loading && items.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
                <div key={`triller-skel-${index}`} className="triller-cart-skeleton">
                  <LoaderSkeleton variant="image" />
                </div>
              ))
            : items.map((item) => (
                <TrillerCart
                  key={item.trillerId || item.id}
                  item={item}
                  onClick={setSelected}
                />
              ))}
        </HorizontalScroll>
      </div>

      {selected ? (
        <TrillerModal item={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  );
};

export default Triller;
