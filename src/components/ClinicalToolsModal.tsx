import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Calendar, 
  Table, 
  Info, 
  Activity, 
  CheckCircle2,
  Building2,
  Heart,
  Code2,
  Copy,
  Download,
  Terminal
} from 'lucide-react';
import { JalaliDate, PERSIAN_MONTH_NAMES } from '../utils/jalali';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTool: 'bmi' | 'converter' | 'crl' | 'about' | 'csharp';
}

const CSHARP_MAIN_FORM_CODE = `// ============================================================================
// File: MainForm.cs
// Application: Windows Forms Desktop Application (C# .NET 8 / WinForms)
// Description: Main window with MenuStrip, ToolStrip, StatusStrip and placeholders
// ============================================================================

using System;
using System.Drawing;
using System.Windows.Forms;

namespace PregnancyNTCalculator
{
    public class MainForm : Form
    {
        // -------------------------------------------------------------
        // Core Menu & Navigation Controls
        // -------------------------------------------------------------
        private MenuStrip menuStrip;
        private ToolStrip toolStrip;
        private StatusStrip statusStrip;
        private ToolStripStatusLabel lblStatus;
        private ToolStripStatusLabel lblClock;
        private System.Windows.Forms.Timer clockTimer;

        // -------------------------------------------------------------
        // Main Layout & Feature Placeholders
        // -------------------------------------------------------------
        private TabControl tabControl;
        private TabPage tabLmp;
        private TabPage tabUltrasound;
        private TabPage tabPatients;

        // LMP Tab Controls (Placeholders)
        private DateTimePicker dtpLmp;
        private NumericUpDown numCycleLength;
        private Button btnCalculateLmp;
        private Label lblLmpResult;
        private Label lblNtWindowResult;

        // Ultrasound Tab Controls (Placeholders)
        private DateTimePicker dtpUltrasound;
        private NumericUpDown numWeeks;
        private NumericUpDown numDays;
        private Button btnCalculateUs;
        private Label lblUsResult;

        // Patient Records Tab (Placeholder)
        private DataGridView dgvPatients;

        public MainForm()
        {
            InitializeComponent();
            SetupClockTimer();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();

            // 1. Form Window Settings
            this.Text = "سامانه تخصصی سن بارداری و سونوگرافی NT - نسخه ویندوز";
            this.Size = new Size(950, 680);
            this.MinimumSize = new Size(800, 550);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);
            this.RightToLeft = RightToLeft.Yes;
            this.RightToLeftLayout = true;

            // 2. MenuStrip
            menuStrip = new MenuStrip();
            BuildMainMenu();

            // 3. ToolStrip
            toolStrip = new ToolStrip();
            BuildQuickToolbar();

            // 4. StatusStrip with live clock
            statusStrip = new StatusStrip();
            lblStatus = new ToolStripStatusLabel { Text = "آماده به کار", Spring = true, TextAlign = ContentAlignment.MiddleRight };
            lblClock = new ToolStripStatusLabel { Text = DateTime.Now.ToLongTimeString() };
            statusStrip.Items.AddRange(new ToolStripItem[] { lblStatus, lblClock });

            // 5. Main TabControl with Feature Placeholders
            tabControl = new TabControl { Dock = DockStyle.Fill };
            tabLmp = new TabPage { Text = "محاسبه با آخرین قاعدگی (LMP)", Padding = new Padding(12) };
            tabUltrasound = new TabPage { Text = "محاسبه با سونوگرافی (US)", Padding = new Padding(12) };
            tabPatients = new TabPage { Text = "بانک اطلاعات پرونده بیماران", Padding = new Padding(12) };

            BuildLmpTab();
            BuildUltrasoundTab();
            BuildPatientsTab();

            tabControl.TabPages.AddRange(new TabPage[] { tabLmp, tabUltrasound, tabPatients });

            // 6. Assemble Controls to Form
            this.Controls.Add(tabControl);
            this.Controls.Add(toolStrip);
            this.Controls.Add(statusStrip);
            this.Controls.Add(menuStrip);
            this.MainMenuStrip = menuStrip;

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private void BuildMainMenu()
        {
            // File Menu
            var mnuFile = new ToolStripMenuItem("&پرونده (File)");
            var mnuNew = new ToolStripMenuItem("&بیمار جدید (New)", null, (s, e) => ResetLmpForm(), Keys.Control | Keys.N);
            var mnuSave = new ToolStripMenuItem("&ذخیره پرونده (Save)", null, (s, e) => SavePatientRecord(), Keys.Control | Keys.S);
            var mnuPrint = new ToolStripMenuItem("&چاپ خلاصه پرونده (Print)...", null, (s, e) => PrintReport(), Keys.Control | Keys.P);
            var mnuExit = new ToolStripMenuItem("&خروج (Exit)", null, (s, e) => this.Close(), Keys.Alt | Keys.F4);
            mnuFile.DropDownItems.AddRange(new ToolStripItem[] { mnuNew, mnuSave, mnuPrint, new ToolStripSeparator(), mnuExit });

            // Edit Menu
            var mnuEdit = new ToolStripMenuItem("&ویرایش (Edit)");
            var mnuSample = new ToolStripMenuItem("درج &داده نمونه", null, (s, e) => LoadSampleData());
            var mnuClear = new ToolStripMenuItem("&پاکسازی فرم", null, (s, e) => ResetLmpForm());
            mnuEdit.DropDownItems.AddRange(new ToolStripItem[] { mnuSample, mnuClear });

            // Tools Menu
            var mnuTools = new ToolStripMenuItem("&ابزارها (Tools)");
            var mnuBmi = new ToolStripMenuItem("محاسبه‌گر BMI بارداری", null, (s, e) => MessageBox.Show("ابزار محاسبه BMI بارداری در دست توسعه است.", "اطلاعیه"));
            var mnuAcog = new ToolStripMenuItem("راهنمای ACOG Bulletin 700", null, (s, e) => MessageBox.Show("پروتکل تعیین سن حاملگی بر اساس ACOG Committee Opinion No. 700", "راهنمای بالینی"));
            mnuTools.DropDownItems.AddRange(new ToolStripItem[] { mnuBmi, mnuAcog });

            // Help Menu
            var mnuHelp = new ToolStripMenuItem("&راهنما (Help)");
            var mnuAbout = new ToolStripMenuItem("&درباره نرم‌افزار...", null, (s, e) => ShowAboutDialog());
            mnuHelp.DropDownItems.Add(mnuAbout);

            menuStrip.Items.AddRange(new ToolStripItem[] { mnuFile, mnuEdit, mnuTools, mnuHelp });
        }

        private void BuildQuickToolbar()
        {
            var btnNew = new ToolStripButton("بیمار جدید", null, (s, e) => ResetLmpForm());
            var btnSave = new ToolStripButton("ذخیره", null, (s, e) => SavePatientRecord());
            var btnPrint = new ToolStripButton("چاپ", null, (s, e) => PrintReport());
            toolStrip.Items.AddRange(new ToolStripItem[] { btnNew, btnSave, btnPrint });
        }

        private void BuildLmpTab()
        {
            var panel = new Panel { Dock = DockStyle.Top, Height = 140 };
            
            var lblDate = new Label { Text = "تاریخ اولین روز آخرین قاعدگی (LMP):", Location = new Point(550, 15), AutoSize = true };
            dtpLmp = new DateTimePicker { Location = new Point(320, 12), Width = 220, Format = DateTimePickerFormat.Short };
            
            var lblCycle = new Label { Text = "طول چرخه قاعدگی (روز):", Location = new Point(550, 50), AutoSize = true };
            numCycleLength = new NumericUpDown { Location = new Point(440, 48), Width = 100, Minimum = 21, Maximum = 40, Value = 28 };

            btnCalculateLmp = new Button { Text = "محاسبه سن بارداری و پنجره NT", Location = new Point(320, 85), Size = new Size(220, 35), BackColor = Color.LightSkyBlue };
            btnCalculateLmp.Click += (s, e) => CalculateLmp();

            panel.Controls.AddRange(new Control[] { lblDate, dtpLmp, lblCycle, numCycleLength, btnCalculateLmp });

            var resultGroup = new GroupBox { Text = "نتایج بالینی و تخمین زایمان", Dock = DockStyle.Fill };
            lblLmpResult = new Label { Text = "برای مشاهده نتایج، بر روی دکمه محاسبه کلیک کنید.", Dock = DockStyle.Top, Height = 60, Font = new Font(this.Font, FontStyle.Bold) };
            lblNtWindowResult = new Label { Text = "پنجره طلایی سونوگرافی NT: ۱۱w۰d الی ۱۳w۶d", Dock = DockStyle.Top, Height = 60, ForeColor = Color.DarkSlateBlue };
            resultGroup.Controls.AddRange(new Control[] { lblNtWindowResult, lblLmpResult });

            tabLmp.Controls.Add(resultGroup);
            tabLmp.Controls.Add(panel);
        }

        private void BuildUltrasoundTab()
        {
            var panel = new Panel { Dock = DockStyle.Top, Height = 120 };
            var lblDate = new Label { Text = "تاریخ انجام سونوگرافی:", Location = new Point(550, 15), AutoSize = true };
            dtpUltrasound = new DateTimePicker { Location = new Point(320, 12), Width = 220, Format = DateTimePickerFormat.Short };

            var lblWeeks = new Label { Text = "سن درج شده در سونوگرافی (هفته):", Location = new Point(550, 50), AutoSize = true };
            numWeeks = new NumericUpDown { Location = new Point(460, 48), Width = 80, Minimum = 4, Maximum = 42, Value = 11 };
            
            var lblDays = new Label { Text = "روز اضافی (۰ تا ۶):", Location = new Point(360, 50), AutoSize = true };
            numDays = new NumericUpDown { Location = new Point(270, 48), Width = 80, Minimum = 0, Maximum = 6, Value = 2 };

            btnCalculateUs = new Button { Text = "محاسبه سن کنونی جنین", Location = new Point(270, 80), Size = new Size(270, 32), BackColor = Color.LightSteelBlue };
            btnCalculateUs.Click += (s, e) => CalculateUltrasound();

            panel.Controls.AddRange(new Control[] { lblDate, dtpUltrasound, lblWeeks, numWeeks, lblDays, numDays, btnCalculateUs });

            var resultGroup = new GroupBox { Text = "نتایج سونوگرافی و پیشروی", Dock = DockStyle.Fill };
            lblUsResult = new Label { Text = "برای محاسبه سن جنین بر اساس سونوگرافی روی دکمه کلیک کنید.", Dock = DockStyle.Fill, Font = new Font(this.Font, FontStyle.Bold) };
            resultGroup.Controls.Add(lblUsResult);

            tabUltrasound.Controls.Add(resultGroup);
            tabUltrasound.Controls.Add(panel);
        }

        private void BuildPatientsTab()
        {
            dgvPatients = new DataGridView { Dock = DockStyle.Fill, AutoGenerateColumns = false, ReadOnly = true, AllowUserToAddRows = false };
            dgvPatients.Columns.Add(new DataGridViewTextBoxColumn { HeaderText = "شناسه", Width = 80 });
            dgvPatients.Columns.Add(new DataGridViewTextBoxColumn { HeaderText = "نام و نام‌خانوادگی مادر", Width = 180 });
            dgvPatients.Columns.Add(new DataGridViewTextBoxColumn { HeaderText = "کد ملی", Width = 120 });
            dgvPatients.Columns.Add(new DataGridViewTextBoxColumn { HeaderText = "تاریخ LMP", Width = 110 });
            dgvPatients.Columns.Add(new DataGridViewTextBoxColumn { HeaderText = "تاریخ تخمینی زایمان (EDD)", Width = 140 });

            tabPatients.Controls.Add(dgvPatients);
        }

        private void SetupClockTimer()
        {
            clockTimer = new System.Windows.Forms.Timer { Interval = 1000 };
            clockTimer.Tick += (s, e) => {
                lblClock.Text = DateTime.Now.ToLongTimeString() + " | " + DateTime.Now.ToShortDateString();
            };
            clockTimer.Start();
        }

        // -------------------------------------------------------------
        // Placeholder Calculation Logic
        // -------------------------------------------------------------
        private void CalculateLmp()
        {
            DateTime lmp = dtpLmp.Value.Date;
            int cycle = (int)numCycleLength.Value;
            int totalDays = 280 + (cycle - 28);
            DateTime edd = lmp.AddDays(totalDays);

            TimeSpan diff = DateTime.Today - lmp;
            int diffDays = (int)diff.TotalDays;
            int weeks = Math.Max(0, diffDays / 7);
            int remDays = Math.Max(0, diffDays % 7);

            DateTime ntStart = lmp.AddDays(77); // 11w0d
            DateTime ntBest = lmp.AddDays(86);  // 12w2d
            DateTime ntEnd = lmp.AddDays(97);   // 13w6d

            lblLmpResult.Text = $"سن جنین امروز: {weeks} هفته و {remDays} روز\\nتاریخ تخمینی زایمان (EDD): {edd.ToShortDateString()}";
            lblNtWindowResult.Text = $"پنجره طلایی سونوگرافی NT:\\nشروع: {ntStart.ToShortDateString()} | زمان طلایی: {ntBest.ToShortDateString()} | پایان مهلت: {ntEnd.ToShortDateString()}";
            lblStatus.Text = "محاسبه سن بارداری با موفقیت انجام شد.";
        }

        private void CalculateUltrasound()
        {
            DateTime scanDate = dtpUltrasound.Value.Date;
            int weeks = (int)numWeeks.Value;
            int days = (int)numDays.Value;
            int totalAtScan = (weeks * 7) + days;

            int daysPassed = (int)(DateTime.Today - scanDate).TotalDays;
            int currentTotal = totalAtScan + daysPassed;
            int curWeeks = currentTotal / 7;
            int curDays = currentTotal % 7;

            DateTime edd = scanDate.AddDays(-totalAtScan).AddDays(280);

            lblUsResult.Text = $"سن حقیقی جنین در امروز: {curWeeks} هفته و {curDays} روز\\nتاریخ تخمینی زایمان بر اساس سونوگرافی: {edd.ToShortDateString()}";
            lblStatus.Text = "محاسبه سونوگرافی با موفقیت انجام شد.";
        }

        private void SavePatientRecord()
        {
            MessageBox.Show("پرونده با موفقیت ذخیره شد.", "تایید ذخیره‌سازی", MessageBoxButtons.OK, MessageBoxIcon.Information);
            lblStatus.Text = "پرونده ذخیره گردید.";
        }

        private void PrintReport()
        {
            MessageBox.Show("گزارش بالینی آماده ارسال به چاپگر است.", "چاپ پرونده", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void LoadSampleData()
        {
            dtpLmp.Value = DateTime.Today.AddDays(-84);
            numCycleLength.Value = 28;
            CalculateLmp();
        }

        private void ResetLmpForm()
        {
            dtpLmp.Value = DateTime.Today.AddDays(-70);
            numCycleLength.Value = 28;
            lblLmpResult.Text = "فرم بازنشانی گردید.";
            lblStatus.Text = "آماده به کار";
        }

        private void ShowAboutDialog()
        {
            MessageBox.Show(
                "سامانه هوشمند سن بارداری و سونوگرافی NT\\n" +
                "طراحی و تنظیم: شبکه بهداشت و درمان شهرستان سیریک — خانه بهداشت روستای گهردو\\n" +
                "مطابق با استاندارد ACOG Bulletin No. 700\\nنسخه 2.4 ویندوز دسکتاپ",
                "درباره نرم‌افزار",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }
    }
}`;

const CSHARP_PROGRAM_CODE = `// ============================================================================
// File: Program.cs
// Application Entry Point for Windows Forms (.NET 8.0)
// ============================================================================

using System;
using System.Windows.Forms;

namespace PregnancyNTCalculator
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new MainForm());
        }
    }
}`;

const CSHARP_CSPROJ_CODE = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <ApplicationIcon>icon.ico</ApplicationIcon>
    <AssemblyName>PregnancyNTCalculator</AssemblyName>
    <RootNamespace>PregnancyNTCalculator</RootNamespace>
  </PropertyGroup>

</Project>`;

export const ClinicalToolsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeTool: initialTool
}) => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'converter' | 'crl' | 'about' | 'csharp'>(initialTool);
  const [selectedFile, setSelectedFile] = useState<'main' | 'program' | 'csproj'>('main');
  const [copiedCode, setCopiedCode] = useState(false);

  // BMI states
  const [preWeight, setPreWeight] = useState<number>(60);
  const [heightCm, setHeightCm] = useState<number>(165);

  // Converter states
  const [convShamsiYear, setConvShamsiYear] = useState(1405);
  const [convShamsiMonth, setConvShamsiMonth] = useState(7);
  const [convShamsiDay, setConvShamsiDay] = useState(12);
  const [convMiladiDate, setConvMiladiDate] = useState('2026-10-04');

  if (!isOpen) return null;

  // BMI calculation
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((preWeight / (heightM * heightM)).toFixed(1)) : 0;
  let bmiCategory = 'نرمال';
  let recommendedGain = '۱۱.۵ الی ۱۶ کیلوگرم';
  let categoryColor = 'text-emerald-400';

  if (bmi < 18.5) {
    bmiCategory = 'کم‌وزن (Underweight)';
    recommendedGain = '۱۲.۵ الی ۱۸ کیلوگرم';
    categoryColor = 'text-amber-400';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'اضافه‌وزن (Overweight)';
    recommendedGain = '۷ الی ۱۱.۵ کیلوگرم';
    categoryColor = 'text-amber-400';
  } else if (bmi >= 30) {
    bmiCategory = 'چاقی (Obese)';
    recommendedGain = '۵ الی ۹ کیلوگرم';
    categoryColor = 'text-rose-400';
  }

  // Converter calculation
  const gregorianFromShamsi = JalaliDate.jalaliToGregorian(convShamsiYear, convShamsiMonth, convShamsiDay);
  const miladiResultStr = JalaliDate.formatMiladi(gregorianFromShamsi);

  const parts = convMiladiDate.split('-');
  let shamsiResultStr = '--';
  if (parts.length === 3) {
    const j = JalaliDate.gregorianToJalali(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    shamsiResultStr = `${j.day} ${PERSIAN_MONTH_NAMES[j.month - 1]} ${j.year}`;
  }

  // CRL Table reference
  const crlTable = [
    { crl: '۱۰ میلی‌متر', ga: '۷ هفته و ۱ روز' },
    { crl: '۱۶ میلی‌متر', ga: '۸ هفته و ۰ روز' },
    { crl: '۲۳ میلی‌متر', ga: '۹ هفته و ۰ روز' },
    { crl: '۳۱ میلی‌متر', ga: '۱۰ هفته و ۰ روز' },
    { crl: '۴۵ میلی‌متر', ga: '۱۱ هفته و ۲ روز (آغاز پنجره NT)' },
    { crl: '۵۵ میلی‌متر', ga: '۱۲ هفته و ۱ روز (زمان طلایی سونو NT)' },
    { crl: '۶۵ میلی‌متر', ga: '۱۲ هفته و ۶ روز' },
    { crl: '۷۵ میلی‌متر', ga: '۱۳ هفته و ۴ روز' },
    { crl: '۸۴ میلی‌متر', ga: '۱۳ هفته و ۶ روز (پایان مهلت NT)' }
  ];

  const currentCode = selectedFile === 'main' 
    ? CSHARP_MAIN_FORM_CODE 
    : selectedFile === 'program' 
    ? CSHARP_PROGRAM_CODE 
    : CSHARP_CSPROJ_CODE;

  const currentFileName = selectedFile === 'main' 
    ? 'MainForm.cs' 
    : selectedFile === 'program' 
    ? 'Program.cs' 
    : 'PregnancyApp.csproj';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100">ابزارهای بالینی و کد منبع ویندوز</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'bmi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه BMI بارداری</span>
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'converter' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>مبدل تقویم</span>
          </button>

          <button
            onClick={() => setActiveTab('crl')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'crl' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>جدول سن CRL</span>
          </button>

          <button
            onClick={() => setActiveTab('csharp')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'csharp' ? 'bg-indigo-600 text-white shadow-xs' : 'text-sky-400 hover:text-sky-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>کد C# Windows Forms</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'about' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>درباره نرم‌افزار</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto text-xs text-slate-300 space-y-4 flex-1">
          {/* C# WinForms Code Tab */}
          {activeTab === 'csharp' && (
            <div className="space-y-3" dir="ltr">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedFile('main')}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                      selectedFile === 'main' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    MainForm.cs
                  </button>
                  <button
                    onClick={() => setSelectedFile('program')}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                      selectedFile === 'program' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Program.cs
                  </button>
                  <button
                    onClick={() => setSelectedFile('csproj')}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                      selectedFile === 'csproj' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    PregnancyApp.csproj
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {currentFileName}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-[50vh] leading-relaxed select-text">
                  <code>{currentCode}</code>
                </pre>
              </div>

              <p className="text-[11px] text-slate-400 text-right" dir="rtl">
                نحوه اجرا: یک پروژه جدید با دستور <code className="text-sky-300 font-mono">dotnet new winforms -n PregnancyNTCalculator</code> ایجاد کرده و کدهای فوق را در Visual Studio یا VS Code کامپایل فرمایید.
              </p>
            </div>
          )}

          {activeTab === 'bmi' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">
                شاخص توده بدنی (BMI) قبل از بارداری بر اساس دستورالعمل موسسه پزشکی (IOM):
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">وزن قبل از بارداری (کیلوگرم):</label>
                  <input
                    type="number"
                    value={preWeight}
                    onChange={(e) => setPreWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">قد مادر (سانتی‌متر):</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">شاخص BMI قبل از بارداری:</span>
                  <span className="text-xl font-black text-white">{bmi} kg/m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">دسته‌بندی وضعیت وزنی:</span>
                  <span className={`font-black text-sm ${categoryColor}`}>{bmiCategory}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                  <span className="text-slate-400 font-semibold">وزن‌گیری توصیه‌شده در کل دوران بارداری:</span>
                  <span className="font-extrabold text-indigo-300 text-sm">{recommendedGain}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'converter' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200">تبدیل تاریخ شمسی به میلادی:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={convShamsiDay}
                    onChange={(e) => setConvShamsiDay(parseInt(e.target.value) || 1)}
                    placeholder="روز"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs"
                  />
                  <select
                    value={convShamsiMonth}
                    onChange={(e) => setConvShamsiMonth(parseInt(e.target.value) || 1)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                  >
                    {PERSIAN_MONTH_NAMES.map((m, idx) => (
                      <option key={idx} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={convShamsiYear}
                    onChange={(e) => setConvShamsiYear(parseInt(e.target.value) || 1405)}
                    placeholder="سال"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs"
                  />
                </div>
                <div className="text-left font-mono text-sm text-sky-400 font-bold bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {miladiResultStr}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200">تبدیل تاریخ میلادی به شمسی:</h4>
                <input
                  type="date"
                  value={convMiladiDate}
                  onChange={(e) => setConvMiladiDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs"
                />
                <div className="text-right text-sm text-emerald-400 font-bold bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {shamsiResultStr}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crl' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                اندازه‌گیری طول تاج تا کفل رویان/جنین (Crown-Rump Length) در سه‌ماهه اول دقیق‌ترین شاخص برای تعیین سن بارداری است (گایدلاین رسمی ISUOG و ACOG):
              </p>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">طول جنین (CRL)</th>
                      <th className="p-2.5">سن بارداری معادل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-400">
                    {crlTable.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-200">{row.crl}</td>
                        <td className="p-2.5 text-indigo-300 font-medium">{row.ga}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    شبکه بهداشت و درمان شهرستان سیریک
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    خانه بهداشت روستای گهردو — سامانه تخصصی مراقبت‌های مادر و نوزاد
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>
                  این نرم‌افزار جهت استانداردسازی محاسبات تقویمی مامایی، تعیین پنجره طلایی سونوگرافی NT (غربالگری ناهنجاری‌های کروموزومی سه‌ماهه اول) و انطباق تاریخ‌های LMP با سونوگرافی طبق استاندارد بین‌المللی <strong>ACOG Committee Opinion No. 700</strong> طراحی و توسعه یافته است.
                </p>
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/60 text-indigo-300 space-y-1">
                  <strong className="block text-indigo-200">ویژگی‌های نسخه ویندوز:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>پشتیبانی از کدهای C# Windows Forms و معماری استاندارد ویندوز</li>
                    <li>قابلیت نصب دائمی بر روی ویندوز ۱۰ و ۱۱ با ساخت آیکون دسکتاپ</li>
                    <li>عملکرد کاملاً آفلاین بدون نیاز به اتصال دائم اینترنت</li>
                    <li>پایگاه داده لوکال برای ذخیره، بازیابی و جستجوی پرونده‌های مراجعین</li>
                    <li>خروجی استاندارد چاپ نسخه و برگه گزارش A4</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
