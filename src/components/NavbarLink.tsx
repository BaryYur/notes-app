import React, { useContext, useState } from "react";

import { useTheme } from "../components/ThemeProvider";

import { NavLink } from "react-router-dom";

import ListsContext from "../context/list-context";

import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../components/ui/dropdown-menu";
import { ListModal } from "../components/ListModal";
import { Home, Calendar, CheckSquare, MoreVertical, Delete, Trash2, Pencil } from "lucide-react";

interface NavbarLinkProps {
  listId?: string,
  path: string,
  color: string,
  isHome?: boolean,
  isToday?: boolean,
  isCompleted?: boolean,
  counter: number,
  onCloseBar: () => void,
  emoji?: string | undefined,
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  listId,
  path,
  color,
  isHome,
  isToday,
  isCompleted,
  counter,
  onCloseBar,
  emoji,
}) => {
  // const navigate = useNavigate();
  const { theme } = useTheme();
  const { deleteTodoList, removeAllTasks } = useContext(ListsContext);
  // const [activeLink, setActiveLink] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenListModal, setIsOpenListModal] = useState(false);

  const listName = path.length > 17 ? path.slice(0, 20) + "..." : path;

  return (
    <div>
      <NavLink
        to={`/app/${path.toLowerCase()}`}
        className={({ isActive }) => {
          return `
            ${isActive && "active-navbar-link dark:bg-[#353941] bg-[#f9fafb]"} 
            block rounded-[13px] relative z-[1] overflow-hidden`;
        }}
      >
        <div
          className={`
            flex justify-between items-center navbar-link
            py-[8px] px-[11px] hover:bg-gray-50 dark:hover:bg-[#353941]
          `}
        >
          <div className="flex items-center gap-2">
            {!isHome && !isToday && !isCompleted && !emoji && (
              <div
                style={{ borderColor: color }}
                className="rounded-[4px] border-[2.3px] h-[10px] w-[10px] max-h-[10px]"
              />
            )}
            {emoji && <div className="text-[13px] ml-[-2px] mr-[-4px]">{emoji}</div>}
            <div
              className="w-[110px] h-full absolute left-0 opacity-[0.08] nav-color-box hidden"
              style={{
                backgroundColor: color,
                filter: "blur(10px)",
              }}
            />
            {isHome && <Home size={13} strokeWidth={3} />}
            {isToday && <Calendar size={13} strokeWidth={3} />}
            {isCompleted && <CheckSquare size={13} strokeWidth={3} />}
            <span className="text-[15px]">
              {listName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-[8px] h-[30px] relative z-[10] dots-btn hover:bg-gray-200 opacity-0 dark:hover:bg-[#4c5158] dark:text-neutral-400"
                >
                  <MoreVertical size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-[10px] absolute left-0 w-[168px]">
                <DropdownMenuGroup>
                  {!isHome && !isToday && !isCompleted && (
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2"
                      onClick={(event) => {
                        event.preventDefault();

                        setIsOpenListModal(true);
                      }}
                    >
                      <Pencil size={15} strokeWidth={2.6} />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (isHome) {
                        removeAllTasks(true, false, false, "");
                      } else if (isToday) {
                        removeAllTasks(false, true, false, "");
                      } else if (isCompleted) {
                        removeAllTasks(false, false, true, "");
                      } else {
                        removeAllTasks(false, false, false, path);
                      }
                    }}
                  >
                    <Delete size={15} strokeWidth={2.6} />
                    <span>Remove all tasks</span>
                  </DropdownMenuItem>
                  {!isHome && !isToday && !isCompleted && (
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2"
                      onClick={(event) => {
                        event.preventDefault();

                        setIsOpenModal(true);
                      }}
                    >
                      <Trash2 size={15} strokeWidth={2.6} />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {counter !== 0 && <div
              className={` 
                ${theme === "dark" && "dark-nav-link-counter"}
                dark:bg-[#4c5158] rounded-[5px] px-[7px] py-[2px] text-[11px]
                text-[#8e939a] font-semibold bg-[#f2f4f9] nav-link-counter
              `}
            >
              {counter}
            </div>}
          </div>
        </div>
      </NavLink>

      <Modal
        title="Are you sure you want to delete this list?"
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsOpenModal(false)}>Close</Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteTodoList(path);
              setIsOpenModal(false);
            }}
          >Delete</Button>
        </div>
      </Modal>

      <ListModal
        listId={listId}
        isOpen={isOpenListModal}
        onClose={() => setIsOpenListModal(false)}
        modalTitle="Changing list"
        placeholder="Change name"
        listColor={color}
        name={path}
        listEmoji={emoji}
      />
    </div>
  );
}

export default NavbarLink;