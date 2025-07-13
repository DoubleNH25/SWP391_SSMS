type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
      <div className="w-15 h-15 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-2xl text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
