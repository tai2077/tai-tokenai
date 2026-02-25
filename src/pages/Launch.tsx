import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Upload,
  CheckCircle2,
  Bot,
  ShieldCheck,
  MessageSquare,
  LineChart,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useStore, Agent } from "../store/useStore";

export default function Launch() {
  const [step, setStep] = useState(1);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const navigate = useNavigate();
  const { launchToken, addToast } = useStore();

  const aiStaff = [
    {
      id: "ops",
      name: "运营官 (OPS)",
      icon: <Bot className="w-6 h-6" />,
      cost: 500,
      role: "OPS" as const,
    },
    {
      id: "analyst",
      name: "分析师 (ANALYST)",
      icon: <LineChart className="w-6 h-6" />,
      cost: 800,
      role: "ANALYST" as const,
    },
    {
      id: "cs",
      name: "客服 (CS)",
      icon: <MessageSquare className="w-6 h-6" />,
      cost: 300,
      role: "CS" as const,
    },
    {
      id: "audit",
      name: "审计员 (AUDIT)",
      icon: <ShieldCheck className="w-6 h-6" />,
      cost: 1000,
      role: "AUDIT" as const,
    },
  ];

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const normalizedTokenName = tokenName.trim();
  const normalizedTokenSymbol = tokenSymbol.trim().toUpperCase();

  const toggleStaff = (staffId: string) => {
    setSelectedStaff((previous) =>
      previous.includes(staffId)
        ? previous.filter((id) => id !== staffId)
        : [...previous, staffId],
    );
  };

  const handleLaunch = () => {
    if (!normalizedTokenName || !normalizedTokenSymbol) {
      addToast("请填写代币名称和符号", "error");
      return;
    }

    const totalCost =
      1000 +
      selectedStaff.reduce((sum, id) => {
        const staff = aiStaff.find((s) => s.id === id);
        return sum + (staff?.cost || 0);
      }, 0);

    const hiredAgents: Agent[] = selectedStaff
      .map((id) => aiStaff.find((staffItem) => staffItem.id === id))
      .filter((staff): staff is (typeof aiStaff)[number] => Boolean(staff))
      .map((staff) => {
        const agentId = `${staff.role}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        return {
          id: agentId,
          name: `${normalizedTokenSymbol} ${staff.name.split(" ")[0]}`,
          role: staff.role,
          level: 1,
          status: "working",
          output: "初始化中...",
          quote: `为 ${normalizedTokenSymbol} 社区服务！`,
          avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${agentId}&backgroundColor=0a0a0c`,
        };
      });

    launchToken(
      {
        name: normalizedTokenName,
        symbol: normalizedTokenSymbol,
        price: 0.001,
        change: "+0.0%",
        mcap: "$10K",
        aiStatus: selectedStaff.length > 0 ? "working" : "resting",
        type: "CREATED",
      },
      totalCost,
      hiredAgents,
    );

    navigate("/ops");
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-2xl mx-auto">
      <PageHeader
        title="一键发币 (LAUNCH)"
        icon={<Rocket className="w-6 h-6" />}
        color="gold"
      />

      {/* Progress */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#333] -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-pixel text-[10px] border-2 ${step >= s ? "bg-[#00FF41] text-black border-[#00FF41] glow-box" : "bg-[#111] text-gray-500 border-[#333]"}`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#333] rounded-lg p-6 hover:border-[#00FF41] transition-colors"
        >
          <h2 className="font-pixel text-[12px] mb-6 text-[#00FF41]">
            STEP 1: 基础信息
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                代币名称 (TOKEN NAME)
              </label>
              <input
                type="text"
                placeholder="e.g. NEON COIN"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full bg-black border border-[#333] rounded p-3 text-[#00FF41] focus:outline-none focus:border-[#00FF41] font-vt text-xl"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                代币符号 (SYMBOL)
              </label>
              <input
                type="text"
                placeholder="e.g. $NEON"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                autoCapitalize="characters"
                className="w-full bg-black border border-[#333] rounded p-3 text-[#00FF41] focus:outline-none focus:border-[#00FF41] font-vt text-xl"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                代币图标 (LOGO)
              </label>
              <div className="border-2 border-dashed border-[#333] rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-[#00FF41] hover:text-[#00FF41] cursor-pointer transition-colors">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">点击上传像素图</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                描述 (DESCRIPTION)
              </label>
              <textarea
                rows={3}
                placeholder="描述你的代币..."
                className="w-full bg-black border border-[#333] rounded p-3 text-[#00FF41] focus:outline-none focus:border-[#00FF41] font-vt text-xl resize-none"
              ></textarea>
            </div>
            <button
              onClick={() => {
                if (!normalizedTokenName || !normalizedTokenSymbol) {
                  addToast("请填写代币名称和符号", "error");
                  return;
                }
                setStep(2);
              }}
              className="w-full bg-[#00FF41] text-black rounded-lg p-4 font-pixel text-[12px] mt-4 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all"
            >
              下一步 (NEXT)
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#333] rounded-lg p-6 hover:border-[#00FF41] transition-colors"
        >
          <h2 className="font-pixel text-[12px] mb-6 text-[#00FF41]">
            STEP 2: 招募 AI 员工
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            为你的代币配备专业的 AI 团队，提升市场表现。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {aiStaff.map((staff) => {
              const isSelected = selectedStaff.includes(staff.id);
              return (
                <button
                  type="button"
                  key={staff.id}
                  onClick={() => toggleStaff(staff.id)}
                  aria-pressed={isSelected}
                  aria-label={`切换 ${staff.name}`}
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${isSelected
                    ? "border-[#00FF41] bg-[#00FF41]/10 glow-box"
                    : "border-[#333] bg-black hover:border-gray-500"
                    }`}
                >
                  <div
                    className={isSelected ? "text-[#00FF41]" : "text-gray-500"}
                  >
                    {staff.icon}
                  </div>
                  <div className="font-pixel text-[10px] text-center">
                    {staff.name}
                  </div>
                  <div className="text-[#FFD700] text-sm">{staff.cost} TAI</div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-black border border-[#333] text-gray-400 rounded-lg p-4 font-pixel text-[10px] hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
            >
              返回 (BACK)
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-[#00FF41] text-black rounded-lg p-4 font-pixel text-[10px] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all"
            >
              下一步 (NEXT)
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#333] rounded-lg p-6 hover:border-[#00FF41] transition-colors text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-[#00FF41] mx-auto mb-6 glow-text" />
          <h2 className="font-pixel text-[16px] mb-2 text-[#FFD700]">
            确认发射 (CONFIRM LAUNCH)
          </h2>
          <p className="text-gray-400 mb-8">你的代币和 AI 团队已准备就绪。</p>

          <div className="bg-black border border-[#333] rounded p-4 text-left mb-8 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">基础发射费用</span>
              <span className="text-[#00FF41]">1,000 TAI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">
                AI 员工招募 ({selectedStaff.length})
              </span>
              <span className="text-[#00FF41]">
                {selectedStaff.reduce(
                  (sum, id) =>
                    sum + (aiStaff.find((s) => s.id === id)?.cost || 0),
                  0,
                )}{" "}
                TAI
              </span>
            </div>
            <div className="border-t border-[#333] pt-3 flex justify-between font-bold text-lg">
              <span className="text-[#FFD700]">总计 (TOTAL)</span>
              <span className="text-[#FFD700]">
                {(
                  1000 +
                  selectedStaff.reduce(
                    (sum, id) =>
                      sum + (aiStaff.find((s) => s.id === id)?.cost || 0),
                    0,
                  )
                ).toLocaleString()} TAI
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-black border border-[#333] text-gray-400 rounded-lg p-4 font-pixel text-[10px] hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
            >
              返回 (BACK)
            </button>
            <button
              onClick={handleLaunch}
              className="flex-[2] bg-[#00FF41] text-black rounded-lg p-4 font-pixel text-[12px] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all animate-pulse"
            >
              确认支付 (PAY & LAUNCH)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
