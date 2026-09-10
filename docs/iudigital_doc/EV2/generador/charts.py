# -*- coding: utf-8 -*-
"""Genera los graficos del documento de la Actividad 2 (CreditSmart en React)."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
os.makedirs(OUT, exist_ok=True)

# Paleta exacta del proyecto (assets/css/02-tokens.css)
BLUE700, BLUE600, BLUE100, BLUE50 = '#1d4ed8', '#2563eb', '#dbeafe', '#eff6ff'
EMERALD, VIOLET, AMBER, ROSE = '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'
TEAL = '#14b8a6'
GRAY900, GRAY700, GRAY500, GRAY300, GRAY200, GRAY100 = (
    '#111827', '#374151', '#6b7280', '#d1d5db', '#e5e7eb', '#f3f4f6')

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Segoe UI', 'Arial', 'DejaVu Sans'],
    'font.size': 9,
    'axes.edgecolor': GRAY300,
    'axes.labelcolor': GRAY700,
    'text.color': GRAY900,
    'xtick.color': GRAY500,
    'ytick.color': GRAY700,
    'figure.dpi': 200,
    'savefig.dpi': 200,
    'savefig.bbox': 'tight',
    'savefig.facecolor': 'white',
})

# Catalogo, identico a src/data/creditsData.js
PRODUCTS = [
    (u'Libre Inversión', 18.5, 1000000, 30000000, 60, BLUE700),
    (u'Vehículo', 14.2, 5000000, 120000000, 84, EMERALD),
    (u'Vivienda', 11.8, 20000000, 500000000, 240, VIOLET),
    (u'Educativo', 10.5, 500000, 50000000, 72, AMBER),
    (u'Empresarial', 16.0, 10000000, 1000000000, 120, ROSE),
    (u'Libranza', 13.5, 1000000, 80000000, 96, TEAL),
]


def strip_axes(ax, keep_left=True):
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)
    if not keep_left:
        ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color(GRAY300)


def miles(n):
    return '{:,.0f}'.format(n).replace(',', '.')


def cuota(capital, tasa_anual_pct, meses):
    """Sistema frances: la misma formula de CreditSimulationService."""
    i = (1 + tasa_anual_pct / 100.0) ** (1 / 12.0) - 1
    return capital * i / (1 - (1 + i) ** (-meses))


# ------------------------------------------- 1. archivos por capa: Actividad 1 vs 2
def chart_migracion():
    capas = [u'domain', u'application', u'infrastructure', u'config', u'data',
             u'presentación']
    ev1 = [26, 15, 11, 4, 0, 22]
    ev2 = [26, 16, 10, 4, 1, 25]

    y = np.arange(len(capas))
    h = 0.38
    fig, ax = plt.subplots(figsize=(6.6, 3.2))
    ax.barh(y + h / 2, ev1, height=h, color=GRAY300, label=u'Actividad 1 (vanilla)')
    ax.barh(y - h / 2, ev2, height=h, color=BLUE700, label=u'Actividad 2 (React)')

    for yi, (a, b) in enumerate(zip(ev1, ev2)):
        ax.text(a + 0.4, yi + h / 2, str(a), va='center', fontsize=8, color=GRAY700)
        ax.text(b + 0.4, yi - h / 2, str(b), va='center', fontsize=8,
                color=BLUE700, fontweight='bold')

    ax.set_yticks(y)
    ax.set_yticklabels(capas)
    ax.invert_yaxis()
    ax.set_xlabel(u'Archivos')
    ax.set_xlim(0, 31)
    ax.legend(frameon=False, fontsize=8, ncol=2,
              loc='upper center', bbox_to_anchor=(0.5, -0.16))
    strip_axes(ax)
    ax.grid(axis='x', color=GRAY200, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_title(u'El núcleo no cambió: solo se reescribió la presentación',
                 fontsize=10, color=GRAY900, pad=10)
    fig.savefig(os.path.join(OUT, 'chart-migracion.png'))
    plt.close(fig)


# ------------------------------------------- 2. composicion de la capa de React
def chart_react():
    labels = [u'components (11)', u'hooks (7)', u'pages (4)',
              u'context (1)', u'App + main (2)']
    sizes = [11, 7, 4, 1, 2]
    colors = [BLUE700, EMERALD, VIOLET, AMBER, GRAY500]

    fig, ax = plt.subplots(figsize=(5.2, 3.2))
    wedges, _ = ax.pie(sizes, colors=colors, startangle=90,
                       wedgeprops=dict(width=0.42, edgecolor='white', linewidth=1.5))
    ax.text(0, 0.08, '25', ha='center', va='center', fontsize=20,
            fontweight='bold', color=GRAY900)
    ax.text(0, -0.22, u'archivos', ha='center', va='center', fontsize=9, color=GRAY500)
    ax.legend(wedges, labels, frameon=False, fontsize=8,
              loc='center left', bbox_to_anchor=(1.0, 0.5))
    ax.set_title(u'Capa de presentación en React', fontsize=10, color=GRAY900, pad=8)
    fig.savefig(os.path.join(OUT, 'chart-react.png'))
    plt.close(fig)


# ------------------------------------------- 3. tasas del catalogo
def chart_tasas():
    fig, ax = plt.subplots(figsize=(6.4, 3.0))
    names = [p[0] for p in PRODUCTS][::-1]
    rates = [p[1] for p in PRODUCTS][::-1]
    colors = [p[5] for p in PRODUCTS][::-1]

    bars = ax.barh(names, rates, color=colors, height=0.62)
    for bar, r in zip(bars, rates):
        ax.text(r + 0.25, bar.get_y() + bar.get_height() / 2,
                u'{:.1f}%'.format(r).replace('.', ','), va='center',
                fontsize=8.5, color=GRAY700)

    ax.set_xlim(0, 21)
    ax.set_xlabel(u'Tasa efectiva anual (%)')
    strip_axes(ax)
    ax.grid(axis='x', color=GRAY200, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_title(u'Tasa por producto — el simulador usa la del producto elegido',
                 fontsize=10, color=GRAY900, pad=10)
    fig.savefig(os.path.join(OUT, 'chart-tasas.png'))
    plt.close(fig)


# ------------------------------------------- 4. la cuota depende del plazo
def chart_cuota_plazo():
    capital, tasa = 20000000, 14.2      # Crédito Vehículo
    plazos = [12, 24, 36, 48, 60, 72, 84]
    cuotas = [cuota(capital, tasa, m) for m in plazos]
    totales = [c * m for c, m in zip(cuotas, plazos)]

    fig, ax = plt.subplots(figsize=(6.6, 3.2))
    bars = ax.bar([str(m) for m in plazos], [c / 1e6 for c in cuotas],
                  color=EMERALD, width=0.58)
    for bar, c in zip(bars, cuotas):
        ax.text(bar.get_x() + bar.get_width() / 2, c / 1e6 + 0.05,
                '$ ' + miles(round(c, -3)), ha='center', fontsize=7.5, color=GRAY700)

    ax2 = ax.twinx()
    ax2.plot([str(m) for m in plazos], [t / 1e6 for t in totales],
             color=ROSE, marker='o', markersize=4, linewidth=1.6,
             label=u'Total a pagar')
    ax2.set_ylabel(u'Total a pagar (millones)', color=ROSE)
    ax2.tick_params(axis='y', colors=ROSE)
    for s in ('top',):
        ax2.spines[s].set_visible(False)

    ax.set_xlabel(u'Plazo (meses)')
    ax.set_ylabel(u'Cuota mensual (millones)')
    strip_axes(ax)
    ax.grid(axis='y', color=GRAY200, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_title(u'Crédito Vehículo · $ 20.000.000 · 14,2 % E.A.: a más plazo, '
                 u'menor cuota y mayor coste', fontsize=9.5, color=GRAY900, pad=10)
    ax2.legend(frameon=False, fontsize=8, loc='lower right')
    fig.savefig(os.path.join(OUT, 'chart-cuota-plazo.png'))
    plt.close(fig)


# ------------------------------------------- 5. intereses vs capital, año a año
def chart_interes_capital():
    capital, tasa, meses = 20000000, 14.2, 36     # Crédito Vehículo a 3 años
    i = (1 + tasa / 100.0) ** (1 / 12.0) - 1
    c = cuota(capital, tasa, meses)

    saldo = capital
    por_anio = {}
    for mes in range(1, meses + 1):
        interes = saldo * i
        abono = c - interes
        saldo -= abono
        anio = (mes - 1) // 12 + 1
        acc = por_anio.setdefault(anio, [0.0, 0.0])
        acc[0] += interes
        acc[1] += abono

    anios = sorted(por_anio)
    intereses = [por_anio[a][0] / 1e6 for a in anios]
    capitales = [por_anio[a][1] / 1e6 for a in anios]
    etiquetas = [u'Año {}'.format(a) for a in anios]

    fig, ax = plt.subplots(figsize=(6.2, 3.1))
    ax.bar(etiquetas, capitales, color=BLUE700, width=0.5, label=u'Capital')
    ax.bar(etiquetas, intereses, bottom=capitales, color=AMBER, width=0.5,
           label=u'Intereses')

    for x, (cap_, int_) in enumerate(zip(capitales, intereses)):
        ax.text(x, cap_ / 2, '$ ' + miles(round(cap_ * 1e6, -3)), ha='center',
                fontsize=7.5, color='white')
        ax.text(x, cap_ + int_ / 2, '$ ' + miles(round(int_ * 1e6, -3)),
                ha='center', fontsize=7.5, color=GRAY900)

    ax.set_ylabel(u'Millones de pesos')
    ax.legend(frameon=False, fontsize=8, loc='upper right')
    strip_axes(ax)
    ax.grid(axis='y', color=GRAY200, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_title(u'Reparto de cada cuota: el interés cae y el capital crece',
                 fontsize=10, color=GRAY900, pad=10)
    fig.savefig(os.path.join(OUT, 'chart-interes-capital.png'))
    plt.close(fig)


if __name__ == '__main__':
    chart_migracion()
    chart_react()
    chart_tasas()
    chart_cuota_plazo()
    chart_interes_capital()
    print(u'Graficos generados en ' + OUT)
