import { SearchBar } from './SearchBar.jsx';
import { AmountRangeFilter } from './AmountRangeFilter.jsx';
import { SortSelect } from './SortSelect.jsx';

/**
 * CatalogFilters — panel lateral de filtros del catálogo.
 *
 * Reúne los cuatro controles en el orden en que se usan: primero se busca,
 * luego se acota el tipo, después el dinero y el tiempo, y por último se
 * ordena lo que quedó.
 *
 * El panel no filtra nada: traduce gestos a intenciones y las eleva. Quién
 * aplica cada filtro depende de su naturaleza —el texto y el monto los
 * resuelve el dominio; el tipo, el plazo y el orden, la presentación.
 *
 * Capa: PRESENTACIÓN (componente).
 */
export function CatalogFilters({
  query,
  onQueryChange,
  typeOptions,
  selectedIds,
  onToggleType,
  onSelectAllTypes,
  ranges,
  rangeIndex,
  onRangeChange,
  termOptions,
  maxTerm,
  onMaxTermChange,
  sortOptions,
  sortBy,
  onSortChange,
  onClear,
  canClear,
}) {
  const allSelected = selectedIds.length === 0;

  return (
    <aside className="filters desktop-sticky" aria-labelledby="filtros-titulo">
      <h2 className="filters__title" id="filtros-titulo">
        Filtrar resultados
      </h2>

      <SearchBar value={query} onChange={onQueryChange} />

      <fieldset className="filters__group">
        <legend className="filters__legend">Tipo de crédito</legend>

        <div className="filters__options">
          <label className="checkbox" htmlFor="tipo-todos">
            <input
              id="tipo-todos"
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAllTypes}
            />
            Todos
          </label>

          {typeOptions.map(({ id, label }) => (
            <label className="checkbox" key={id} htmlFor={`tipo-${id}`}>
              <input
                id={`tipo-${id}`}
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={() => onToggleType(id)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <AmountRangeFilter ranges={ranges} value={rangeIndex} onChange={onRangeChange} />

      <SortSelect
        id="filter-term"
        name="maxTerm"
        label="Plazo"
        options={termOptions}
        value={maxTerm}
        onChange={onMaxTermChange}
      />

      <SortSelect
        options={sortOptions}
        value={sortBy}
        onChange={onSortChange}
      />

      <div className="filters__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onClear}
          disabled={!canClear}
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
