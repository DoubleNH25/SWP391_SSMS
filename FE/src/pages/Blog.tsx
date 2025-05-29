export default function Blog() {
    return (
        <div className="mx-auto sm:px-0 xl:px-0 relative max-w-screen-2xl">
            <div className="flex flex-wrap justify-center">
                {/* Top blog */}
                <div className="max-w-full mx-auto border-2 w-[1280px] flex flex-col justify-center lg:flex-row lg:items-start gap-6 lg:gap-8 bg-white shadow-lg rounded-xl p-4 lg:p-6 mx-4 mt-8 lg:mx-10">
                    <div className="lg:max-w-[536px] w-full">
                        <img
                            className="w-full h-auto max-h-96 min-h-40 rounded-lg object-cover"
                            src="https://i.pravatar.cc/100?u=admin"
                            alt="..."
                        />
                    </div>

                    <div className="lg:max-w-[740px] w-full flex flex-col justify-between max-h-96 overflow-hidden">
                        <div>
                            <a
                                href="category.html"
                                className="inline-flex text-purple-dark bg-purple-100 font-medium text-sm py-2 px-5 rounded-full mb-3"
                            >
                                Lifestyle
                            </a>
                            <h1 className="font-bold text-2xl lg:text-3xl text-dark line-clamp-3 mb-3">
                                <a href="blog-single.html">
                                    Begin here to obtain a brief summary encompassing all the essential
                                </a>
                            </h1>
                            <p className="max-w-[524px] text-base line-clamp-3">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit laboriosam vitae sunt quasi, dignissimos magnam nihil reprehenderit totam cumque, blanditiis neque praesentium similique sed saepe eveniet veritatis labore rerum? Fugiat?
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-5">
                            <a href="author.html" className="flex items-center">
                                <p className="text-sm">Adrio Devid</p>
                            </a>
                            <span className="flex w-[3px] h-[3px] rounded-full bg-gray-500"></span>
                            <p className="text-sm">Sep 10, 2025</p>
                        </div>
                    </div>
                </div>

                {/*List blog */}
                {[1, 2,4,43,324].map((_, index) => (
                    <div className="lg:max-w-[651px] w-full flex flex-col sm:flex-row sm:items-center rounded-xl">
                        <div className="max-w-full mx-auto border-2 w-[1280px] flex flex-col justify-center lg:flex-row lg:items-start gap-6 lg:gap-8 bg-white shadow-lg rounded-xl p-2 lg:p-6 mt-5 mx-2 lg:mx-2">

                            <div className="lg:max-w-[536px] w-full">
                                <img
                                    className="w-full h-auto max-h-96 rounded-lg object-cover"
                                    src="https://i.pravatar.cc/100?u=admin"
                                    alt="..."
                                />
                            </div>

                            {/* Phần text, giới hạn max height và ẩn tràn */}
                            <div className="lg:max-w-[640px] w-full flex flex-col justify-between max-h-96 overflow-hidden">
                                <div>
                                    <a
                                        href="category.html"
                                        className="inline-flex text-purple-dark bg-purple-100 font-medium text-sm py-2 px-5 rounded-full mb-3"
                                    >
                                        Lifestyle
                                    </a>
                                    <h1 className="font-bold text-2xl lg:text-3xl text-dark mb-3 line-clamp-3">
                                        <a href="blog-single.html">
                                            Begin here to obtain a brief summary encompassing all the essential
                                        </a>
                                    </h1>
                                    <p className="max-w-[524px] text-base line-clamp-3">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit laboriosam vitae sunt quasi, dignissimos magnam nihil reprehenderit totam cumque, blanditiis neque praesentium similique sed saepe eveniet veritatis labore rerum? Fugiat?
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-5">
                                    <a href="author.html" className="flex items-center">
                                        <p className="text-sm">Adrio Devid</p>
                                    </a>
                                    <span className="flex w-[3px] h-[3px] rounded-full bg-gray-500"></span>
                                    <p className="text-sm">Sep 10, 2025</p>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}