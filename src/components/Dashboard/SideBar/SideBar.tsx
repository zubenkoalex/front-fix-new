import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./SideBar.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { AnimatePresence, motion } from "motion/react";
import { Bug, Help, HelpCenter, HideBar, Logotype, Logout, Policy, Settings, Sparkles } from "../../SVG";
import { ArrowRightThin } from "../../SVG/Arrows/ArrowRightThin";
import { sideBarCategories, SideBarCategory } from "../../../types/Dashboard";
import { ContextMenu, SideBarCategoryComponent } from "../../UI";
import { pixelToVH, vhToPx } from "../../../utils/pxConvertor";
import { ContextMenuItem } from "../../../types/UI";
import { useNavigate } from "react-router-dom";


export const SideBar: FC = () => {
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.accountReducer);
    const {isSideBarOpen} = useAppSelector(state => state.dashboardReducer);
    const {toggleSideBar, setActiveModal} = useActions(allActions.dashboard);

    const currentFullName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();

    const profileRef = useRef<HTMLDivElement>(null);

    const [contextMenu, setContextMenu] = useState<boolean>(false);
    const [animationDone, setAnimationDone] = useState<boolean>(isSideBarOpen);
    const [containerAnimationDone, setCntainerAnimationDone] = useState<boolean>(isSideBarOpen);

    useEffect(() => {
        let timerContainer: number;
        setAnimationDone(isSideBarOpen)
        if (isSideBarOpen) {
            setCntainerAnimationDone(isSideBarOpen)
        } else {
            timerContainer = setTimeout(() => setCntainerAnimationDone(isSideBarOpen), 380);
        }

        return () => clearTimeout(timerContainer);
    }, [isSideBarOpen]);

    const updatePlan = () => {
        navigate("/dashboard/plans")
    }

    const openSettings = () => {
        setActiveModal("settings")
    }
    
    const sideBarProfileOptions: ContextMenuItem[][] = useMemo(() => [
        [
            // {
            //     key: "update-plan",
            //     Icon: Sparkles,
            //     title: "Обновить план",
            //     onClick: updatePlan
            // },
            {
                key: "settings",
                Icon: Settings,
                title: "Настройки",
                onClick: openSettings
            },
            {
                key: "help",
                Icon: Help,
                title: "Справка",
                subCategories: [
                    {
                        key: "centre",
                        Icon: HelpCenter,
                        title: "Справочный центр",
                        link: "/help"
                    },
                    {
                        key: "terms",
                        Icon: Policy,
                        title: "Условия и политика",
                        link: "/policies"
                    },
                    {
                        key: "report",
                        Icon: Bug,
                        title: "Сообщить об ошибке",
                    },
                ]
            },
        ],
        [
            {
                key: "exit",
                Icon: (props) => <Logout isHovered={false} {...props} />,
                title: "Выйти"
            }
        ],
    ], [])

    const selectCategory = (category: SideBarCategory) => navigate(category.link || "");
    

    return (
        <motion.div
            layout
            initial={false}
            animate={isSideBarOpen ? { minWidth: "18.2291vw"} : {width: "4.6875vw", minWidth: "4.6875vw"}}
            transition={{ duration: 0.2, ease: "linear" }}
            className={`
                ${styles["side-bar"]}
                ${containerAnimationDone ? "" : styles["closed"]} 
            `}
        >
            <div className={styles["content"]}>
                <div className={styles["header-container"]}>
                    <div className={styles["header"]}>
                        <div className={styles["logotype"]}>
                            <Logotype className={styles["icon"]} />
                            <AnimatePresence>
                                {animationDone &&                             
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15, ease: "easeInOut", delay: isSideBarOpen ? 0.3 : 0 }}
                                        className={styles["name"]}
                                    >
                                        dzen
                                    </motion.span>
                                }
                            </AnimatePresence>
                        </div>
                        <AnimatePresence>
                            {animationDone &&                         
                                <motion.div 
                                    className={styles["hide-container"]}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15, ease: "easeInOut", delay: isSideBarOpen ? 0.3 : 0}}
                                    onClick={() => toggleSideBar()}
                                >
                                    <HideBar className={styles["icon"]} />
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                    <div className={styles["hidden-header"]}>
                        <div className={styles["logotype"]}>
                            <Logotype className={styles["icon"]} />
                        </div>
                        <AnimatePresence>
                            {!animationDone &&                         
                                <motion.div 
                                    className={styles["hide-container"]}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15, ease: "easeInOut", delay: isSideBarOpen ? 0 : 0.3 }}
                                    onClick={() => toggleSideBar()}
                                >
                                    <HideBar className={styles["icon"]} />
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                </div>
                <div className={styles["categories"]}>
                    {sideBarCategories.map((category) => (
                        <SideBarCategoryComponent 
                            key={category.key} 
                            category={category} 
                            active={location.pathname.includes(category.key) || (location.pathname === "/dashboard" && category.key === "home")}
                            closed={!isSideBarOpen}
                            onClick={selectCategory}
                        />
                    ))}
                </div>
                {contextMenu && <ContextMenu className={styles["context-menu"]} setActive={setContextMenu} elements={sideBarProfileOptions}/>}
            </div>
            <AnimatePresence mode="wait">
                {animationDone ?
                    <motion.div 
                        key="open"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut", delay: isSideBarOpen ? 0.3 : 0 }}
                        onClick={() => setContextMenu(!contextMenu)}
                        className={styles["profile-container"]}
                    >
                        <div 
                            ref={profileRef}
                            className={`${styles["profile"]} ${contextMenu ? styles["active"] : ""}`}
                        >
                            <div className={styles["avatar"]}>
                                <img src={user?.avatarPath} className={styles["image"]} />
                            </div>
                            <div className={styles["info"]}>
                                <span>{currentFullName}</span>
                                {/* <span>premium plan</span> */}
                            </div>
                        </div>
                   
                    </motion.div>
                    :
                    <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut", delay: isSideBarOpen ? 0 : 0.3  }}
                        onClick={() => setContextMenu(!contextMenu)}
                        className={`${styles["profile-container"]} ${styles["hidden"]}`}
                    >
                        <div 
                            ref={profileRef}
                            className={`${styles["profile"]} ${contextMenu ? styles["active"] : ""}`}
                        >
                            <div className={styles["avatar"]}>

                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </motion.div>
    );
};